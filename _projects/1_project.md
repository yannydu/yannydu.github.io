---
layout: page
title: ChessMate - An Interactive Chessboard
description: Built for ENSC 440 at SFU
img: assets/img/automate_logo.jpg
importance: 1
category: learning
---

## Overview

The goal of this project was to create a chessboard that automates piece movement, allowing a single player to enjoy a game of chess without needing to manually move the opponent's pieces.
This combination of traditional chess with modern technology offers a unique and interactive experience.

## Key Features

- **Automated Piece Movement**: Chess pieces move with human interaction
- **Player Piece Movement Detection**: Registers the move that the player made
- **Adjustable Difficulty**: Players can choose from 8 difficulty levels for their bot opponent
- **Traditional Design**: Chessboard was crafted from maple and walnut, preserving the classic feel of the game while integrating modern features

## Technologies

- **Electromagnetic Trolley**: Chess pieces with embedded magnets are moved using an electromagnetic trolley assembled on an XY table.
- **Board State Detection**: A Raspberry Pi camera paired with OpenCV captures the board state in real time
- **Lichess**: For game analytics tracking and Stockfish engine for the bot opponent
- **Web Application**: Built using Flask, provides a user interface to configure and start games
- **Raspberry Pi**: Serves as the host for the chessboard's service, managing all operations

## Challenges

One of my responsibilities was developing the piece movement detection module. Initially, there was a suggestion within the team to use machine learning to identify and track pieces, but given our lack of ML experience and the pressing need to focus on other critical modules, I opted for a more straightforward approach using OpenCV.

The approach I developed involved tracking piece movement by comparing the chess square occupancies before and after a player's move. To do this, I first needed to detect the corners of each chess square. Without access to the finalized board for testing, I started with a photo of the board that my teammate was working on. I successfully used the Hough Line Transform to detect the corners, and the initial results were promising.

However, after the chessboard surface was finished and I began testing with the Raspberry Pi camera, the algorithm encountered issues. The camera captured additional corner points due to the wood grain patterns and significant light glare on certain regions of the board.

With only two weeks left before the demo day and my lack of experience with OpenCV, refactoring the original solution did not yield any improvement. As a result, I decided to manually calibrate the camera by selecting the corner points directly in the captured image. Although this solution lacked the robustness I had initially aimed for, the fixed camera setup ensured that the piece movement detection still functioned as intended.

## Lessons Learned

- **Prioritize and stay focused**: Identify and ensure that key features work as intended. Don't lose focus on important requirements and get distracted by tasks further down.
- **Rapid Iteration**: Taking longer to develop a solution doesn't guarantee correctness. Iterating quickly and refining work based on testing worked the best when creating the product.
- **Ownership and Collaboration**: To take full responsibility for my contributions and being mindful how my work affects my fellow collaborators works.
- **Structured Testing**: Prioritize creating structured tests and unit tests throughout the development process.

## Conclusions

This project has given me a deeper appreciation for the technologies I have used without much thought.
I'd like to thank the SFU Instructional team and Lab Engineers for all their help and support throughout the endeavor.
