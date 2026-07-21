#!/usr/bin/env bash

# Read-only checks for the generated Jekyll site after WSCAN remediations.

set -u
set -o pipefail

site_dir=${1:-_site}
failure_count=0

pass() {
    printf 'PASS: %s\n' "$1"
}

fail() {
    printf 'FAIL: %s\n' "$1" >&2
    failure_count=$((failure_count + 1))
}

print_matches() {
    printf '%s\n' "$1" | sed 's/^/  - /' >&2
}

scan_forbidden() {
    label=$1
    pattern=$2
    matches=$(rg -l -U --pcre2 -g '*.html' -e "$pattern" -- "$site_dir" 2>&1)
    scan_status=$?

    case $scan_status in
        0)
            fail "$label"
            print_matches "$matches"
            ;;
        1)
            pass "$label"
            ;;
        *)
            fail "$label (rg exited with status $scan_status)"
            print_matches "$matches"
            ;;
    esac
}

if [ "$#" -gt 1 ]; then
    printf 'Usage: %s [built-site-directory]\n' "$0" >&2
    exit 2
fi

if ! command -v rg >/dev/null 2>&1; then
    printf 'FAIL: rg is required but was not found\n' >&2
    exit 2
fi

if [ ! -d "$site_dir" ]; then
    printf 'FAIL: built-site directory does not exist: %s\n' "$site_dir" >&2
    exit 2
fi

html_files=$(rg --files -g '*.html' -- "$site_dir" 2>&1)
html_status=$?
if [ $html_status -ne 0 ] || [ -z "$html_files" ]; then
    printf 'FAIL: no generated HTML files found under %s\n' "$site_dir" >&2
    if [ $html_status -gt 1 ]; then
        print_matches "$html_files"
    fi
    exit 2
fi

legacy_missing=''
for relative_path in \
    '2020/01/08/zerodepth.html' \
    '2021/02/28/whoami.html'
do
    if [ ! -f "$site_dir/$relative_path" ]; then
        legacy_missing="${legacy_missing}${legacy_missing:+
}${relative_path}"
    fi
done

if [ -z "$legacy_missing" ]; then
    pass 'legacy compatibility pages exist'
else
    fail 'legacy compatibility pages exist'
    print_matches "$legacy_missing"
fi

legacy_target_failures=''
while IFS='|' read -r relative_path canonical_url redirect_path; do
    page_path="$site_dir/$relative_path"
    [ -f "$page_path" ] || continue

    if ! rg -q -F -e "rel=\"canonical\" href=\"$canonical_url\"" -- "$page_path" || \
       ! rg -q -F -e "http-equiv=\"refresh\" content=\"0; url=$redirect_path\"" -- "$page_path"; then
        legacy_target_failures="${legacy_target_failures}${legacy_target_failures:+
}${relative_path} -> ${redirect_path}"
    fi
done <<'EOF'
2020/01/08/zerodepth.html|https://ux.snu.ac.kr/blog/2020/01/08/zerodepth.html|/blog/2020/01/08/zerodepth.html
2021/02/28/whoami.html|https://ux.snu.ac.kr/blog/2021/02/28/whoami.html|/blog/2021/02/28/whoami.html
EOF

if [ -z "$legacy_target_failures" ]; then
    pass 'legacy pages declare the expected canonical and refresh targets'
else
    fail 'legacy pages declare the expected canonical and refresh targets'
    print_matches "$legacy_target_failures"
fi

# Ignore markup inside HTML comments and literal <pre>/<code> examples. The
# remaining branches inspect active tags only, including tags split over lines.
inactive_markup='(?is)<!--.*?-->(*SKIP)(*F)|<(?:pre|code)\b.*?</(?:pre|code)\s*>(*SKIP)(*F)|'
external_script="${inactive_markup}<script\b(?=[^>]*\bsrc\s*=)[^>]*\bsrc\s*=\s*(?:[\"']\s*)?(?:https?:)?//"
external_stylesheet="${inactive_markup}<link\b(?=[^>]*\brel\s*=\s*(?:[\"'][^\"']*\bstylesheet\b[^\"']*[\"']|stylesheet\b))(?=[^>]*\bhref\s*=)[^>]*\bhref\s*=\s*(?:[\"']\s*)?(?:https?:)?//"
insecure_active_resource="${inactive_markup}(?:<(?:script|img|iframe)\b(?=[^>]*\bsrc\s*=)[^>]*\bsrc\s*=\s*(?:[\"']\s*)?http://|<link\b(?=[^>]*\brel\s*=\s*(?:[\"'][^\"']*\bstylesheet\b[^\"']*[\"']|stylesheet\b))(?=[^>]*\bhref\s*=)[^>]*\bhref\s*=\s*(?:[\"']\s*)?http://)"

scan_forbidden \
    'no external or protocol-relative script src attributes' \
    "$external_script"
scan_forbidden \
    'no external or protocol-relative stylesheet href attributes' \
    "$external_stylesheet"
scan_forbidden \
    'no active HTTP script, stylesheet, image, or iframe resources' \
    "$insecure_active_resource"
scan_forbidden \
    'no raw snuxlab@gmail.com address' \
    '(?i)snuxlab@gmail\.com'
scan_forbidden \
    'no Bot Framework embed s= token' \
    "(?i)webchat\\.botframework\\.com/embed/[^\\s\"'<>]*(?:\\?|&|&amp;)s="
scan_forbidden \
    'no GitHub Page not found content' \
    '(?i)Page\s+not\s+found'

representative_pages='index.html
about.html
people.html
project.html
blog.html'
referrer_missing=''
vendor_reference_missing=''
referrer_pattern="(?is)<meta\\b(?=[^>]*\\bname\\s*=\\s*[\"']?referrer[\"']?)(?=[^>]*\\bcontent\\s*=\\s*[\"']strict-origin-when-cross-origin[\"'])[^>]*>"
vendor_pattern="${inactive_markup}(?:src|href)\\s*=\\s*[\"']\\K[^\"']*assets/vendor/[^\"'?#]+"

while IFS= read -r relative_path; do
    [ -n "$relative_path" ] || continue
    page_path="$site_dir/$relative_path"

    if [ ! -f "$page_path" ] || ! rg -q -U --pcre2 -e "$referrer_pattern" -- "$page_path"; then
        referrer_missing="${referrer_missing}${referrer_missing:+
}${relative_path}"
    fi

    if [ ! -f "$page_path" ] || ! rg -q -U --pcre2 -e "$vendor_pattern" -- "$page_path"; then
        vendor_reference_missing="${vendor_reference_missing}${vendor_reference_missing:+
}${relative_path}"
    fi
done <<EOF
$representative_pages
EOF

if [ -z "$referrer_missing" ]; then
    pass 'representative pages declare strict-origin-when-cross-origin'
else
    fail 'representative pages declare strict-origin-when-cross-origin'
    print_matches "$referrer_missing"
fi

if [ -z "$vendor_reference_missing" ]; then
    pass 'representative pages reference local vendor assets'
else
    fail 'representative pages reference local vendor assets'
    print_matches "$vendor_reference_missing"
fi

vendor_refs=$(rg -o --no-filename -U --pcre2 -g '*.html' -e "$vendor_pattern" -- "$site_dir" 2>&1 | sort -u)
vendor_status=$?
missing_vendor=''
vendor_count=0

if [ $vendor_status -eq 0 ]; then
    while IFS= read -r vendor_ref; do
        [ -n "$vendor_ref" ] || continue
        vendor_count=$((vendor_count + 1))
        vendor_path="assets/vendor/${vendor_ref#*assets/vendor/}"
        if [ ! -f "$site_dir/$vendor_path" ]; then
            missing_vendor="${missing_vendor}${missing_vendor:+
}${vendor_path}"
        fi
    done <<EOF
$vendor_refs
EOF
fi

case $vendor_status in
    0)
        if [ $vendor_count -eq 0 ]; then
            fail 'generated HTML contains local vendor references'
        elif [ -n "$missing_vendor" ]; then
            fail "all generated vendor references resolve ($vendor_count checked)"
            print_matches "$missing_vendor"
        else
            pass "all generated vendor references resolve ($vendor_count checked)"
        fi
        ;;
    1)
        fail 'generated HTML contains local vendor references'
        ;;
    *)
        fail "vendor reference scan completed (rg exited with status $vendor_status)"
        print_matches "$vendor_refs"
        ;;
esac

if [ $failure_count -ne 0 ]; then
    printf 'RESULT: FAIL (%d check%s failed)\n' \
        "$failure_count" "$([ "$failure_count" -eq 1 ] || printf 's')" >&2
    exit 1
fi

printf 'RESULT: PASS (WSCAN static checks completed for %s)\n' "$site_dir"
