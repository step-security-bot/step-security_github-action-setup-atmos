[![StepSecurity Maintained Action](https://raw.githubusercontent.com/step-security/maintained-actions-assets/main/assets/maintained-action-banner.png)](https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions)



<!-- markdownlint-disable -->
<p align="right">
  <a href="https://github.com/step-security/github-action-setup-atmos/releases/latest"><img src="https://img.shields.io/github/release/step-security/github-action-setup-atmos.svg?style=for-the-badge" alt="Latest Release"/></a>
  <a href="https://github.com/step-security/github-action-setup-atmos/commits"><img src="https://img.shields.io/github/last-commit/step-security/github-action-setup-atmos.svg?style=for-the-badge" alt="Last Updated"/></a>
</p>
<!-- markdownlint-restore -->

# github-action-setup-atmos

Install atmos for use in GitHub Actions.




## Introduction

This repo contains a GitHub Action to setup [atmos](https://github.com/cloudposse/atmos) for use in GitHub Actions. It
installs the specified version of atmos and adds it to the `PATH` so it can be used in subsequent steps. In addition,
it optionally installs a wrapper script that will capture the `stdout`, `stderr`, and `exitcode` of the `atmos`
command and make them available to subsequent steps via outputs of the same name.




## Usage

```yaml
steps:
  - uses: step-security/setup-terraform@v4

  - name: Setup atmos
    uses: step-security/github-action-setup-atmos@v2
````

To install a specific version of atmos, set the `atmos-version` input:

```yaml
steps:
  - uses: step-security/setup-terraform@v4

  - name: Setup atmos
    uses: step-security/github-action-setup-atmos@v2
    with:
      atmos-version: 0.15.0
````

The wrapper script installation can be skipped by setting the `install-wrapper` input to `false`:

```yaml
steps:
  - uses: step-security/setup-terraform@v4

  - name: Setup atmos
    uses: step-security/github-action-setup-atmos@v2
    with:
      install-wrapper: false
````

SHA256SUMS validation defaults to `warn`, which validates when checksums are published and warns if they are missing.
Set `checksum-validation` to `enforce` to fail when checksums are missing, or `skip` to disable checksum validation.
Checksum mismatches always fail when validation runs.

Subsequent steps of the GitHub action can use the wrapper script to capture the `stdout`, `stderr`, and `exitcode` if
the wrapper script was installed:

```yaml
steps:
  - uses: step-security/setup-terraform@v4

  - name: Setup atmos
    uses: step-security/github-action-setup-atmos@v2
    with:
      install-wrapper: true

  - name: Run atmos
    id: atmos
    run: atmos terraform plan

  - run: echo ${{ steps.atmos.outputs.stdout }}
  - run: echo ${{ steps.atmos.outputs.stderr }}
  - run: echo ${{ steps.atmos.outputs.exitcode }}
```

## Inputs
<!-- markdownlint-disable -->
| Name | Description | Default | Required |
|------|-------------|---------|----------|
| atmos-version | Version Spec of the version to use. Examples: 1.x, 10.15.1, >=10.15.0. | latest | false |
| checksum-validation | Controls SHA256SUMS validation. Use `warn` to validate when checksums are published and warn when they are missing, `enforce` to fail when checksums are missing, or `skip` to disable checksum validation. Checksum mismatches always fail when validation runs. | warn | false |
| install-wrapper | Flag to indicate if the wrapper script will be installed to wrap subsequent calls of the `atmos` binary and expose its STDOUT, STDERR, and exit code as outputs named `stdout`, `stderr`, and `exitcode` respectively. Defaults to `true`. | true | false |
| token | Used to pull atmos distributions from Cloud Posse's GitHub repository. Since there's a default, this is typically not supplied by the user. When running this action on github.com, the default value is sufficient. When running on GHES, you can pass a personal access token for github.com if you are experiencing rate limiting. | ${{ github.server\_url == 'https://github.com' && github.token \|\| '' }} | false |
<!-- markdownlint-restore -->


## Outputs
<!-- markdownlint-disable -->
| Name | Description |
|------|-------------|
| atmos-version | The installed atmos version. |
<!-- markdownlint-restore -->



For 🐛 bug reports & feature requests, please use the [issue tracker](https://github.com/step-security/github-action-setup-atmos/issues).

## License

<a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge" alt="License"></a>

This project is licensed under the [Apache 2.0 License](LICENSE).

## Trademarks

All other trademarks referenced herein are the property of their respective owners.

---

Copyright © 2017-2026 [Cloud Posse, LLC](https://cpco.io/copyright)
Copyright (c) 2026 StepSecurity
