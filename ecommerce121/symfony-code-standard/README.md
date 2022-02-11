README
======

## Installation

You can install this library using composer

``` bash
$ composer require ecommerce121/coding-standard --dev
```

or add the package to your `composer.json` file directly.

Composer will install the library to your project's `vendor/ecommerce121` directory.

## Phing configuration

Add this to your phing's `build.xml` file:

``` xml
    <target name="check:cs" description="Checks coding standard." depends="prepare">
        <echo msg="Checking coding standard ..." />
        <phpcodesniffer standard="vendor/ecommerce121/coding-standard/Ecommerce121"
                        showSniffs="true"
                        showWarnings="true">
            <fileset refid="sourcecode" />
            <formatter type="checkstyle" outfile="${dir.reports}/checkstyle.xml" />
        </phpcodesniffer>
    </target>
```

You have to configure your reports directory:

``` xml
    <property name="dir.reports" value="${dir.build}/logs" />
```

## PHP Storm configuration

In `Settings/Languages & Frameworks/PHP/CodeSniffer` configure directory to point to your phpcs binary.

In `Settings/Editor/PHP/Inspections` enable `PHP/PHP Code Sniffer validation`

In `Settings/Editor/PHP/Inspections/PHP/Code Sniffer` select custom coding standard and point directory to `[PROJECT_DIR]/vendor/ecommerce121/coding-standard/Ecommerce121`
