[![CircleCI](https://circleci.com/gh/smucode/react-world-flags.svg?style=svg)](https://circleci.com/gh/smucode/react-world-flags)

> **Attention!**  This is a fork of `react-world-flags` and provides two alternative methods of usage which can greatly reduce bundle size when using ESM-friendly bundlers: [Cherry-Picking](#option-1-cherry-picking) and [Raster Flags](#option-2-raster-flags)

# react-world-flags

Easy to use SVG flags of the world for react

[Demo](https://smucode.github.io/react-world-flags/)

## Installation

```
npm install --save @weston/react-world-flags
```

## Usage

```jsx
import Flag from '@weston/react-world-flags'

<Flag code={ code } />
```

Where `code` is the [two letter](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2), [three letter](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) or [three digit](https://en.wikipedia.org/wiki/ISO_3166-1_numeric) country code.

You can also pass an optional `fallback` which renders if the given code doesn't correspond to a flag:

```jsx
import Flag from '@weston/react-world-flags'

<Flag code="foo" fallback={ <span>Unknown</span> } />
```

All props but `code` and `fallback` are passed through to the rendered `img`

```jsx
<Flag code="nor" height="16" />

// <img src="data:image/svg+xml..." height="16">
```

SVG's are inlined using [Data_URIs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).

## Alternative Usage

By default, bundlers will include all flags provided by this library which will add about 1.2 MB gzipped to your application.

This fork (`@weston/react-world-flags`) provides two alternative methods of usage which can greatly reduce bundle size when using ESM-friendly bundlers: **Cherry-Picking** and **Raster Flags**

### Option 1: Cherry-Picking

Import just the flags needed for your application. This is useful for scenarios in which you only need a small subset of available flags and don't need to look them up by country code. Unused flags should automatically be omitted by your bundler via static analysis (tree-shaking).

```jsx
// Only import flags for USA and Canada
import { FlagUS, FlagCA } from '@weston/react-world-flags'

<FlagUS />
<FlagCA />
```

### Option 2: Raster Flags

Substitute default SVG flags with raster versions for flags having large amounts of detail (highly detailed images are generally more compact when represented as bitmaps). This approach automatically replaces these flags with WebP versions which can significantly reduce bundle size. Use this for scenarios where your application still needs the entire catalog of flags but having flags of fixed size is acceptable (e.g. icons).

The following example will produce either an SVG or WebP (of height 128px) depending on which is more compact given a particular country's flag:
```jsx
import { Flag128 as Flag } from '@weston/react-world-flags'

// Mexico's flag is detailed and always smaller as WebP
<Flag code="mx" />
// result: <img src="data:image/webp..." height="128">

// Japan's flag is simple and always smaller as SVG
<Flag code="jp" />
// result: <img src="data:image/svg+xml..." height="128">

// Still able to customize image height
<Flag code="mx" height="100" />
// result: <img src="data:image/webp..." height="100">
```

Rasters are available in 32px, 64px, 128px, 256px, and 512px versions (i.e. `Flag32`, `Flag64`, `Flag128`, `Flag256`, or `Flag512`).

#### Bundle Footprint

| Import | Image Type | Bundle Size (gzip) |
|:------:|:----------:|:--------------------:|
| `Flag` | Default, SVG | 1.18 MB |
| `{ Flag512 }` | SVG or WebP (512px) | 0.80 MB (68%) |
| `{ Flag256 }` | SVG or WebP (256px) | 0.52 MB (44%) |
| `{ Flag128 }` | SVG or WebP (128px) | 0.30 MB (26%) |
| `{ Flag64 }`  | SVG or WebP (64px) | 0.19 MB (16%) |
| `{ Flag32 }`  | SVG or WebP (32px) | 0.13 MB (11%) |
