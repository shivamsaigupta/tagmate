<p align="center">
  <img align="center" src="https://tagmateapp.com/assets/images/tagmate_black.png" width="290"/>
</p>

<p align="center">
<a href='https://apps.apple.com/in/app/tagmate/id1468743902?mt=8'><img alt='Get it on App Store' src='https://tagmateapp.com/assets/images/apple_badge.svg' height="50" /></a> &ensp; <a href='https://play.google.com/store/apps/details?id=com.chillmate&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://tagmateapp.com/assets/images/playstore_badge_str.png' height="50" /></a> &ensp; <a href="https://www.producthunt.com/posts/tagmate?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-tagmate" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=167765&theme=light" alt="Tagmate - Discover & host meetups near you | Product Hunt Embed" style="width: 233px; height: 50px;" width="233px" height="50px" /></a> 
</p>

<p align="center">

![login screenshot](https://tagmateapp.com/gifs/login.gif)  ![home screenshot](https://tagmateapp.com/gifs/swipe1.gif) ![host screenshot](https://tagmateapp.com/gifs/host.gif)

</p>

Tagmate is a fully-deployed production-level cross-platform app built using React-Native and serverless architecture. The app, which is live on Google Play Store and Apple App Store, allows you to discover new events and host your own events in your university.

# What's under the hood?

Tagmate is built using React-Native along with a serverless architecture for maximum scalability. The app utilizes Firebase's Cloud Functions extensively to ensure elastic capacity. 

The app features include 

 - Swipable newsfeed
 - Integration with Google Calendar
 - Push Notifications (for both iOS and Android devices)
 - User profiles
 - Google Authentication integration
 - Group messaging
 - Direct messaging
 - and more...

# Demo

Check out Tagmate live on [Google Play Store](https://play.google.com/store/apps/details?id=com.chillmate) or [Apple App Store](https://apps.apple.com/us/app/instajude/id1468743902). You will need a university email ID to login. If you are, however, an Apple device user, you may use the following demo account to login.

>  - **Demo Account Credentials**
>  - Email: tagmatedemo@ashoka.edu.in
>  - Password: TagmateIsCool<3

# Instructions
If you are trying to create your own Tagmate-like app by forking this repo, please follow the instructions below.

1. Create a Firebase project
2. Enable Google SignIn in Authentication tab
3. Generate `google-services.json` file and put it in `./android/app` path.

If you want to build an APK for Android, ensure you've set your credentials in `./android/gradle.properties`.

# Credits
Tagmate was originally intended to be a commercial project and was founded by Shivam Sai Gupta ([@shivamsaigupta](https://github.com/shivamsaigupta)) and Neeraj Pandey ([@neerajp99](https://github.com/neerajp99)). *As of January 2020, we have made a decision to stop supporting the commercially available Tagmate and make it open-source.*

# Contributors
>  - @shivamsaigupta
>  - @neerajp99
>   - Contributors Welcome!
