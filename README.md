# 🎨🦕 Deno Artwork

A Deno artwork gallery that has not gone extinct. Powered by Deno... naturally.

## dotland Before Time

A small collection of Deno artwork exists at [deno.com/artwork](https://deno.com/artwork), but contributions are no longer accepted there.
Deno's website had to go closed-source and its [denoland/dotland](https://github.com/denoland/dotland) repository has been turned into a public archive. 

Dry your eyes! Here is a new and improved Deno artwork gallery to take its place. Made with [all the Deno fixins](#exemplary-environment).

__[artwork.deno.dev](https://artwork.deno.dev "Deno Artwork Gallery")__

## Exemplary Environment

[![Made with Fresh](https://fresh.deno.dev/fresh-badge-dark.svg)](https://fresh.deno.dev)

- Hosted on __Deno Deploy__
- Powered by __Deno KV__:
  - Stores and organizes artwork collection
  - Allows __GitHub user login__ with [Deno KV OAuth plugin for Fresh](https://deno.land/x/deno_kv_oauth@v0.7.0)
  - Saves user reactions ("Likes") 🍕
- Made with __Fresh__
  - Styled with Twind
  - REST interface for posting reactions
  - Features image and artist pages
  - Simple admin console
  - OpenGraph image generation and `<head>` content for artwork gallery pages
  - Uses [TSX Tabler Icons](https://tabler-icons-tsx.deno.dev/)
  - Default avatars provided by [Deno Avatar](https://deno-avatar.deno.dev/)
  - RSS feed — because why not!
- Open-source. __Accepting code and artwork contributions.__

# Contributing

Reacting to artwork (requires GitHub login), [Starring this repo](https://github.com/jasonjgardner/deno-artwork/stargazers), and creating PRs highly encouraged. 

## Artwork
1. [Fork the repo](https://github.com/jasonjgardner/deno-artwork/fork)
2. Make art. (AI welcome!)
3. Save your image in [`./static/images/artwork/`](https://github.com/jasonjgardner/deno-artwork/edit/main/static/images/artwork/)
4. [Edit `./data/artwork.json`](https://github.com/jasonjgardner/deno-artwork/edit/main/data/artwork.json) (There's a [schema](https://github.com/jasonjgardner/deno-artwork/edit/main/data/artwork.schema.json) to follow.)
5. Pretty please use the [`.github/PULL_REQUEST_TEMPLATE/art_pr.md`](https://github.com/jasonjgardner/deno-artwork/blob/main/.github/PULL_REQUEST_TEMPLATE/art_pr.md?plain=1) format in a [new PR](https://github.com/jasonjgardner/deno-artwork/compare).

## Code
1. [Fork the repo](https://github.com/jasonjgardner/deno-artwork/fork)
2. Work your magic. (AI welcome!)
3. Pretty please use the [`.github/PULL_REQUEST_TEMPLATE/code_pr.md`](https://github.com/jasonjgardner/deno-artwork/blob/main/.github/PULL_REQUEST_TEMPLATE/code_pr.md?plain=1) format in a [new PR](https://github.com/jasonjgardner/deno-artwork/compare).

# License
Deno images are distributed under the MIT license (public domain and free for use), unless otherwise noted. Repository code is distributed under the MIT license.
