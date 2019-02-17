# Test Reporter

JavaScript JIRA/Zephyr test reporter. To use you need to create a .env file in the root of the project including the following mandatory and optional variables.

The library is designed to have the *reporter_development_version* set and not the execution, cycle or version. If using semantic version you place the development version, e.g. 0.0.0-sematic-version, as the development version. This will report the name of the project as the cycle name and execution and version as ad hoc and unscheduled respectively. For the release branch, generally master, the library will search for the current version based on the start date of the version.

Example of how to tag the Zephyr tests can be found in the *__component-tests__* folder. The example project was *CUC*.

## Mandatory elements
```
reporter_username=
reporter_password=
reporter_host=
reporter_port=
reporter_protocol= (http or https)
reporter_development_version=
reporter_prefix=
```

## Optional elements
```
reporter_execution= (default -1)
reporter_cycle= (default 'Ad hoc'),
reporter_version= (default 'Unscheduled'),
reporter_development_version=
```