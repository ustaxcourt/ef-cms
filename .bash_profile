npx() {
    if [[ $@ == "jest"* ]]; then
        coverage_file=$(echo "$@" | sed -e "s/jest\s//" -e "s/.test//")
        command npx jest "$@" --coverage --collectCoverageFrom "$coverage_file"
    else
        command npx "$@"
    fi
}
