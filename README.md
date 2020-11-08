# Better overcast.fm

Make the "Active Podcasts" lists on Overcast.fm a bit easier to navigate by grouping episodes by podcast and making each episode list collapsible.

If you have some podcasts with too many episodes taking over the page give this extension a try.

Now available on the [Firefox add-ons directory](https://addons.mozilla.org/en-US/firefox/addon/better-overcast/).

![](./active-episodes.png "Active Episodes")

## Development process

I develop this extension on Firefox following this steps:

1. Open [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
2. Click on "Load Temporary Add-on..."
3. Open the manifest.json file
4. Click Reload every time I do any changes

## Generating the extension

Install dependencies with:

```
yarn
```

Run the following command to build the extension's zip file:

```
yarn run build
```