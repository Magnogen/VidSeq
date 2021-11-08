# VidSeq

VidSeq is a programming language I'm (very badly) working on, to help with the creation of videos.

It produces outputs that can be similar in style to a host of YouTubers, including:
- [TodePond](https://www.youtube.com/c/TodePond)
- [3 Blue 1 Brown](https://www.youtube.com/channel/UCYO_jab_esuFRV4b17AJtAw)
- [Sebastian Lague](https://www.youtube.com/c/SebastianLague)

And a fair few others. If you don't know who these people are, I'd highly recommend checking them out as they can be a great source of inspiration (as evidenced by this project!)

## How it works

The language consists of various Renderable Objects, like `background`, `text` and `circle` - each of which have properties that can be overwritten in order to render what you'd like to render. Here's an example:

```
bg = background ::    // create a variable and assign it the properties of a background
  fill: #001155       // overwrite the existing fill colour with a custom one
```

That program will just draw a solid, dark blue background onto the screen, but you can change any value leter on using a transitional operator:

```
bg = background :: fill: #001155

bg -> :: fill: #550011
```

This will instantly change the colour of `bg` to to be a more reddish colour, but you can make that transition occur over time with the following:

```
bg = background :: fill: #001155

over 1.5 seconds:
  bg -> :: fill: #550011
```

And bam! You have your first animation!

There a bunch of other time-related things I have added, such as:
- Waiting for a specified number of seconds `wait for 3.14 seconds`
- Waiting for a keypress `wait for keypress`
- Waiting until all the current animations are complete `wait for idle`

### Lack of experience
tl;dr I haven't completed this as I have no idea what I'm doing. I want this to be as robust as possible, unlike my other Esolangs, so I'm going about this the proper way - token streams, peek() and Abstract Syntax Trees. If you don't know what I'm talking about, don't worry - I don't either.

If you do know however, let me tell you how far I am. I haven't been able to make sense of actually _parsing_ a list of tokens. I've used regex to consume and appropriately classify groups of text into tokens, but I still need to figure out what I need to do in order to interpret them. My (messy) code is up here, let me know how you get on with it!
