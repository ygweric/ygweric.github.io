---
layout: post
published: true
title:  "Macdown build"
date:   2015-12-5 00:00:00 +0700
categories: it
tags:
- it
- osx
---


Error:

````
Gem::RemoteFetcher::FetchError: Errno::ECONNRESET: Connection reset by peer - SSL_connect (https://rubygems.org/gems/cocoapods-core-0.34.4.gem)
An error occurred while installing cocoapods-core (0.34.4), and Bundler cannot continue.
Make sure that `gem install cocoapods-core -v '0.34.4'` succeeds before bundling.

````

Fix:
in `Gemfile` , change `source 'https://rubygems.org'` to `source 'http://rubygems.org'`