# VidSeq
###### A **Vid**eo **Seq**uencing language https://magnogen.net/VidSeq

VidSeq is a programming language I'm (very badly) working on, to help with the creation of videos.

It produces outputs that can be similar in style to a host of YouTubers, including:
- [TodePond](https://www.youtube.com/c/TodePond)
- [3 Blue 1 Brown](https://www.youtube.com/channel/UCYO_jab_esuFRV4b17AJtAw)
- [Sebastian Lague](https://www.youtube.com/c/SebastianLague)

And a fair few others. If you don't know who these people are, I'd highly recommend checking them out as they can be a great source of inspiration (as evidenced by this project!)

## How it works

The language consists of various Renderable Objects, like `background`, `text` and `circle` - each of which have properties that can be overwritten in order to render what you'd like to render. Here's an example:

```
bg = background <     // create a variable and assign it the properties of a background
  fill: #001155       // overwrite the existing fill colour with a custom one
>
```

That program will just draw a solid, dark blue background onto the screen, but you can change any value later on using a transitional operator:

```
bg = background < fill: #001155 >

bg -> fill: #550011
```

This will instantly change the colour of `bg` to to be a more reddish colour, but you can make that transition occur over time with the following:

```
bg = background < fill: #001155 >

bg -> fill: #550011 over 2s
```

And bam! You have your first animation!

There a bunch of other time-related things I have added, such as:
- Waiting for a specified number of seconds `wait 3.14s`, or minutes (idk why though) `wait 3.14m`
- Waiting for a keypress `wait for keypress`
- Waiting until all the current animations are complete `wait for idle`

