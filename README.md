# Homebrew Uber

## Project Overview
This repository contains the **Homebrew Uber** project, a Python-based simulation designed to model the operational dynamics of a ride-sharing platform. This codebase serves as a framework for analyzing two-sided marketplaces, allowing users to experiment with matching algorithms, pricing strategies, and supply-chain logic in a controlled environment.

## What It Does
The simulation operates by generating a grid-based city environment where "Riders" request trips and "Drivers" fulfill them. The core functionalities include:
* **Ride Matching:** Algorithms to pair riders with the optimal available driver (e.g., nearest neighbor).
* **State Management:** Tracking the status of every agent (Idle, En Route, Busy) and their location on the grid.
* **Dynamic Pricing:** Basic logic to calculate fares based on distance and demand surges.
* **Data Logging:** Records every trip, wait time, and cancellation for post-simulation performance analysis.

## File Structure
Below is the directory structure of the project:

```text
Homebrew-Uber/
├── data/
│   ├── raw/
│   │   ├── drivers.csv         # Initial dataset of driver locations
│   │   └── requests.csv        # Stream of incoming rider requests
│   └── processed/
│       └── ride_logs.csv       # Output file containing completed trip stats
├── src/
│   ├── __init__.py
│   ├── city_grid.py            # Defines the map dimensions and distance calculations
│   ├── driver.py               # Class defining Driver attributes and state
│   ├── rider.py                # Class defining Rider attributes
│   ├── matcher.py              # Logic for pairing Riders with Drivers
│   └── pricing.py              # Logic for fare calculation and surge pricing
├── notebooks/
│   └── simulation_analysis.ipynb # Jupyter notebook for visualizing simulation results
├── tests/
│   └── test_core.py            # Unit tests for matching and pricing logic
├── main.py                     # Main execution script to run the simulation
├── requirements.txt            # Python dependencies
└── README.md                   # Project documentation
