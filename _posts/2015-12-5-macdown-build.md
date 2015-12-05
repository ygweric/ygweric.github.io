---
layout: post
---

Error:

````
Gem::RemoteFetcher::FetchError: Errno::ECONNRESET: Connection reset by peer - SSL_connect (https://rubygems.org/gems/cocoapods-core-0.34.4.gem)
An error occurred while installing cocoapods-core (0.34.4), and Bundler cannot continue.
Make sure that `gem install cocoapods-core -v '0.34.4'` succeeds before bundling.

````

Fix:
in `Gemfile` , change `source 'https://rubygems.org'` to `source 'http://rubygems.org'`