# blockeye

## Pre-requisite

* [Yarn 1.7.0](https://yarnpkg.com/lang/en/docs/install)
* [Xcode and the iOS simulator](https://developer.apple.com/xcode/download)
* [Node 10.0 or later] Download installer from https://nodejs.org/en/download/

Then update via:
```
sudo npm install --prefix /usr/local/lib/ npm
Then `yarn install`
Then `npm start`
Then Y to install expo-cli globally -> but where is it installed?
```

## Install package dependencies of the project

* yarn install

## Configuration

To update configuration variables, open `settings.js` and update.

`AUTH0_CLIENT_ID` - Auth0 Client ID
`AUTH0_CLIENT_DOMAIN` - Auth0 Client Domain
`API_URL` - Endpoint URL for Back-end API


## Login with your Expo account

* expo login
(We are using Auth0.com for authentication so we need to update `Allowed Callback URLs` in Auth0 settings page. For example, https://auth.expo.io/@goldenis331/my-app. Here, `goldenis331` is ID of expo account)

## How to run on simulator (iPhone)

* `npm run ios`

## How to run on your mobile device

1. Run `npm run ios` (Android: `npm run android`) in terminal. Or you can run `npm start` to run the Expo Developer Tool only, without the simulator.
2. Download Expo app on your mobile device and install it. https://itunes.apple.com/us/app/expo-client/id982107779?mt=8 (Android: https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US)
3. Open Expo app on your mobile device and Login with your expo account.
4. Go to `Projects` tab and you will see your mobile app which is running on localhost.
5. Click it to run the app on your mobile device

## How to publish app on TestFlight

* expo build:ios

You will have to provide your Apple Developer userid and password; just say yes to the various defaults. After a few minutes, you will have a standalone build on the expo website; the file ends in archive.ipa. Download the file, open Xcode, and select 'File/Open Developer Tool/Application Loader'. Select the default template ('Deliver your app'), and then upload your App. In App Store Connect (https://appstoreconnect.apple.com/), after some delay, the iOS build should show up in MyApps/TestFlight. It may take as long as 24 hours for the App to finish processing, at which point the testers can access it via the TestFlight app on their computer. 

You can run ` exp build:ios -c ` to clear your local expo credentials - e.g. when you change your provisioning profile. It is not totally clear what the right options are - in the ADV `keys` tab you can request a p8 certificate for Apple Notifications. However, when setting your `App ID configuration` you can also click `Push Notifications` and then `configure` to generate a seperate key (an `aps.cer` file). 

ToDo - figure out which settings/keys are needed to get nofications to work.

Update - in `App ID configuration` you need to select `Push Notifications` but do not click configure. You do not need the `aps.cer` file - all you need is the .p8 file you can generate seperately in the `keys` tab. So you will be left with three files - the `mobileprovision` file, the .p12 file (and the associated password) and the .p8 file (and the associated Key ID).

Every time we build `.ipa` file, we need to update `version` field of `app.json`

## How to publish app for Android via .apk file or google play

`expo build:android`

We might have to use FCM for push notifications. Just in case we set that up and we uploaded our secret server keys to google via:

`expo push:android:upload --api-key AA..................................................................................`

where everything after api_key denotes out very long secret key.

## Testing

1. Update `MY_IP_ADDRESS` to your local IP address and `TEST_MODE=true` in `settings.js`. After testing, please update `TEST_MODE=false` back.
2. Open new tab in terminal and run `npm run stargazer:init`
3. Run `npm run stargazer:server`
4. Run the app using `npm run ios` in another new tab in terminal and you will see `` button. Click that button to capture screenshots.
5. Open new another tab in terminal and run `npm run stargazer:view`. Go to http://localhost:5000 to see captured screenshots.

## Ejecting to ExpoKit...

If you want to deploy the code directly to iPhone via XCode, you can eject to ExpoKit. In the top level directory, run:

`$ expo eject`

Go with the defaults (ExpoKit), and select com.healthblock.blockdoc as the Android package name. If you then go to the iOS folder, there will be an 'blockdoc.xcworkspace' file. Double-click to fire up XCode and add your Apple Developer credentials. At this point the only thing you should need to do is to   

`$ pod install`

as usual. You could eject all the way (and remove anything related to expo, but that would require more changes in the App). If `pod` has issues, then try:

* `$ brew install git-lfs`
* `$ git lfs install`
* `$ pod update`


## Jan's notes - starting with fresh directory...

`yarn install`

`npm run ios` - this fires up the iOS simulator on the desktop. Make sure you are in tunnel mode to run on you iPhone via Expo. The project should appear in the iPhone's expo App's projects tab with an address something like: exp://as-ape.jtliphardt.blockeye...

Sometimes also have to

* `yarn upgrade`
* `yarn add @babel/core@^7.0.0-0`
* `yarn add lodash`
* `yarn add react-native-vector-icons`
* `yarn add prop-types`

For the Trials processing, first run `ParseTrials_#`, which operates on the .xml files. Then run `_CSV_#`, which finds keywords and generates the final CSV file. As the last step, run `ParseTrials_MakeGeoTable` to refresh the geo table buffer.

## Instructions on publishing new app bundles for ios and android

### Android
1. Check current app version: Go to the google play console -> 'all applications' -> 'blockdoc app' -> 'release management' -> 'app releases' -> Under 'Production track' section get the app 'version code'.
2. Open app.json, under 'android' field, change the version code to be the one on website + 1.
3. Run expo build:android, and download the .apk bundle.
4. Go back to google play app releases, under 'Production track' click 'manage' -> 'creat release'.
5. Upload the new app bundle and click 'review' -> change any texts you wanted -> 'roll out to production'.

### IOS
1. Check current app version: Go to App Store Connect -> 'My Apps' -> Under 'IOS APP' section select the latest 'Ready for Sale' app -> Under 'Build' section find the build number (currently is 3.1.x)
2. Open app.json, under 'version' field, change the version code to be the one on website + 1 (3.1.(x+1)).
3. Run expo build:ios, and download the .ipa bundle.
4. Go to Application loader on Jan's Mac mini, upload the .ipa bundle.
5. After the testflight review is done(will take ~ 2hours), go back to App Store Connect, click '+ VERSION OR PLATFORM'.
6. Choose the right app bundle submitted to the testflight, change any information needed, and remember to attach a valid qr code for apple to review.
