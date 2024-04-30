[![Netlify Status](https://api.netlify.com/api/v1/badges/65b1ff01-580c-4c31-972b-5e0ab2d51260/deploy-status)](https://app.netlify.com/sites/bing-wallpaper/deploys)

# Bing Wallpaper

Bing Wallpaper is a proxy application that simplifies the use of BING daily wallpaper.

![Bing Wallpaper](https://bing-wallpaper.netlify.app/wallpaper)

## How to Use

Embed directly using the img tag:

```
<img src="https://bing-wallpaper.netlify.app/wallpaper" />
```

## Parameters

- **w**: width of the image
- **h**: height of the image
- **res**: resolution of the image
- **qlt**: quality of the image

## Browser Extension

We also provide a browser extension that allows you to change the background image of a web page with BING daily wallpaper. Download it [here](https://github.com/antiheroguy/bing-wallpaper/releases).

## Development

Listen for changes and automatically build in real-time with the development environment:

```
yarn watch
```

Build the extension into the `build` folder with the production environment:

```
yarn build
```

Package the built extension into the `release` directory:

```
yarn pack
```

Combines the build and pack scripts:

```
yarn repack
```

Format the source code:

```
yarn format
```
