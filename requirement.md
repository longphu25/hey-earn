# Superteam Earn Telegram Notification Bot Hackathon

## Mission

Develop a Telegram notification bot for Superteam Earn to provide users with personalized alerts for new bounties and projects published on the platform.

## Scope Detail

The Telegram notification bot should perform the following functions:

- Notify users of new opportunities listed on Earn, covering both opportunities relevant to their profile's geography and global opportunities. In other words, notify the user only for those listings that the user is eligible to submit / apply for.

- Allow users to personalize notifications based on:
-- The USD value of the listings.
-- If they want to be notified for Bounties or Projects, or both).
-- Specific skills (users should be able to select from the list of subskills as defined on Earn). These skills can be different from whatever the user has on their profile.

- User Experience (UX):
-- The bot must be accessible via a direct link from the user menu (present on the top right on desktop, and top left on mobile) on Superteam Earn.
-- Clicking the link should seamlessly open the bot interface within Telegram.
-- All configuration settings for the bot (filters, preferences) must be manageable directly within the Telegram bot interface.

- Notification Content: Each notification must include:
-- Title of the listing.
-- Sponsor's name.
-- Reward token name and value.
-- Reward amount in USD.
-- If its a project with variable compensation, then “Variable Comp” should be mentioned.
-- If its a project with range, then appropriately show the range.
-- A direct link to the listing on Superteam Earn. This link must always include the UTM tracking appendix: `?utm_source=telegrambot.`
-- The deadline for the listing.
-- Note: All the above details for notifications are available in the Earn database and do not need to be fetched separately.

- Notification Trigger:
-- Notifications for a new listing should be sent out 12 hours after the listing has been published on Superteam Earn.

- Programming Language and Tools:
-- Typescript
-- Node.js
-- pnpm

## Submission Requirements

- Main Submission Link should be your Github Repo Link

- The Github repo should contain
-- a functional, production-ready Telegram bot
-- Basic demo video showing end to end UX in the README.md file
-- Development and Production setup instructions in the README.md file
-- All environment variables mentioned with a proper .env.example file
-- Pull Request on Earn Github for the user menu links on Superteam Earn

- Access: If the repository is private, share access with jayeshpotlabattini@gmail.com.

- Documentation: The codebase should be well documented, with all setup instructions and test-ready data.

- Deployment: Should be ready to deploy on Vercel or Railway

- By participating, you give Superteam Earn and its contributors the full access and right to use the source code and integrate it into Earn.

## Judging Criteria

Submissions will be evaluated based on the following criteria:

- Functionality: The bot operates as per the specified scope, with all features fully implemented and working correctly.

- Personalization: Effectiveness and accuracy of the notification filtering based on user-selected $ value, listing type, and skills.

- User Experience: Ease of use for setting up preferences and clarity of notifications received via the bot.

- Reliability & Performance: The bot reliably sends notifications according to the 12-hour trigger and handles user interactions efficiently.

- Code Quality: The codebase is well-structured, type-safe, maintainable, and secure.

- Production Readiness: The solution is robust and ready for deployment to users.

- Security Compliance: The bot successfully passes all security evaluations led by Superteam Earn Team.

## Resources

- Earn Github Repo - https://github.com/superteamdao/earn/
- Setup Instructions - https://github.com/SuperteamDAO/earn/blob/main/README.md
- Database Schema - https://github.com/SuperteamDAO/earn/blob/main/prisma/schema.prisma

Use https://one.one.one.one/ If you are not able to access telegram in your region