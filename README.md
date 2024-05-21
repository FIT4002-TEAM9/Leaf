# Leaf
A multi-platform mental health triage application. [Project Page](https://www.monash.edu/it/humanise-lab/research/development-of-mental-health-triage-app-for-clinician).

* [SHORT DEMO LINK](https://www.youtube.com/watch?v=ijm6Z6KCtdk)

* [FULL DEMO LINK](https://www.youtube.com/watch?v=rj6vawIVE68)

View the app's storyboard in **Storyboard (Tablet).pdf**, and familiarise yourself with the app's tablet navigation and layout versus the app's mobile navigation and layout in **Tablet vs Mobile Navigation and Layout.pdf**.

If you're an onboarding developer, read the [onboarding documentation](Onboarding.md).

## Setup

1. Make sure you have latest version of Node.js installed
2. Clone the repository in your local directory

```
$ git clone https://github.com/FIT4002-Group8/Leaf-V2.git
```

2. Open the project directory and run `npm install`

## Running Leaf-ETL service
For the ETL aspect of the application, we use a separate python service. This service can be started locally by:

1. Ensuring that Docker is installed on your device
2. Running the start script at ./Dev-Tools/start.sh
   1. This will build the Leaf-ETL docker container and start it
3. Stop the service by running ./Dev-Tools/stop.sh to spin down the Docker container
4. Restart the service (to load in new changes) by running ./Dev-Tools/restart.sh

## Running on Simulator

#### iOS:

iOS requires macOS in order to run on the simulator.

In the project directory, run one of the following:

```
$ npm run ios
```

```
$ npm start
$ i
```

#### Android:

Android requires you have an Android simulator pre-installed.

Before running the application, ensure the simulator is running beforehand:

```
$ /Users/{yourusername}/Library/Android/sdk/emulator/emulator -avd {devicename} -netdelay none -netspeed full
```

Where `{yourusername}` is your device user name, and `{devicename}` is the device you have installed, e.g. "Pixel_6_Pro_API_33".

Then in the project directory, run one of the following:

```
$ npm run android
```

```
$ npm start
$ a
```

If you have simulators installed via Android Studio, you may experience "BUILD FAILED". In this case, you may want to try this solution: https://stackoverflow.com/a/38847005.

#### Web:

In the project directory, run one of the following:

```
$ npm run web
```

```
$ npm start
$ w
```

## Running on Device

Install the [Expo Go](https://expo.dev/client) app on your iOS or Android phone and connect to the same wireless network as your computer. On Android, use the Expo Go app to scan the QR code from your terminal to open your project. On iOS, use the built-in QR code scanner of the default iOS Camera app.

To generate the QR code, run the following in your project directory:

```
$ npm start
```

## Deployment

To redeploy, run in the project directory:

```
$ npm run deploy
```

The application will be built and published automatically from the `gh-pages` branch.

## Prettify

To prettify (format) all code, run the following in the project directory:

```
$ npx prettier . --write
```

To not lint specific code blocks, refer to the following: https://prettier.io/docs/en/ignore.html

## Linting

To identify lint errors, run the following in the project directory:

```
$ npm run lint
```

## Pruning

To identify unused types, run the following in the project directory:

```
$ npm run prune
```

