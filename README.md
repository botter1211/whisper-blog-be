### Description

Whisper Blog is a weblog that allows people to join by creating accounts. Each User should provide a name, an email, and a password to create an account.

The email address should not link to any account in the system. After joining Whisper Blog, User will be divided into 2 types of accounts: free and paid. If you are a free account, you'll be allowed to view blogs. If you are a premium account, you'll be able to create posts.

Users can update their profile with Avatar, CitizenID (using for recover forgotten password), Social Links, and a short description.

Users can write Posts that contain text content and an image. The new posts will be shown on the user profile page.

### Authentication

As a user, I can stay signed in after refreshing the page.
As a user, I can register for a new account with email and password.
/\*\*

- @route POST /users
- @description Create a new user
- @access public
- @body {name, email, password}
  \*/

As a user, I can sign in with my email and password.
/\*\*

- @route POST /auth/login
- @description Login with email and password
- @access public
- @body {email, password}
  \*/

As a user, I can change a new password.
/\*\*

- @route PUT /auth/updatePassword
- @description Change password
- @access public
- @body {passwordCurrent, password, passwordConfirm}
  \*/

As a user, I can recover password.
/\*\*

- @route PUT /auth/forgotPassword
- @description Change password
- @access public
- @body {citizenId, password, passwordConfirm}
  \*/

/\*\*

- @route GET /users?page=1&limit=10
- @description get users with pagination
- @access login required
  \*/

### Users

As a user, I can see my current profile info.
/\*\*

- @route GET /users/me
- @description Get current user info
- @access login required
  \*/

As a user, I can see a specific user's profile given a user ID.
/\*\*

- @route GET /users/:id
- @description Get a user profile
- @access login required
  \*/

As a user, I can update my profile with Avatar, Social Links, and a short description.
/\*\*

- @route PUT /users/:id
- @description Update user profile
- @body {name, avatarUrl, aboutMe, facebookLink, instagramLink, githubLink, xLink}
- @access login required
  \*/

### Blogs

As a user subscription, I can create, edit and delete blogs.
/\*\*

- @route POST /blogs
- @description Create a new blog
- @access login required
- @body {title, content, coverImage, isAllowComment, isAllowReaction}
  \*/

/\*\*

- @route PUT /blogs
- @description Update blog
- @access login required
- @body {title, content, coverImage, isAllowComment, isAllowReaction}
  \*/

/\*\*

- @route DELETE /blogs/:id
- @description Delete a blog
- @access login required
  \*/

As a user, I can see blogs of other user.
/\*\*

- @route GET /blogs/{slug}
- @description Get single blog
- @access login required
- @body {slug}
  \*/

/\*\*

- @route GET /blogs/user/userId?page=1&limit=10
- @description Get all blogs of user with pagination
- @access login required
  \*/

/\*\*

- @route GET /blogs/published/user/userId?page=1&limit=10
- @description Get published blogs of user with pagination
- @access login required
  \*/

/\*\*

- @route GET /blogs/home/user/userId?page=1&limit=10
- @description Get published blogs of user with pagination
- @access login required
  \*/

/\*\*

- @route GET /blogs
- @description Get blogs for guest
  \*/

### Comments

As a user, I can comments to blogs.
/\*\*

- @route POST /comments
- @description Create a new comment
- @access login required
- @body {content, blogId}
  \*/

As a user, I can edit my comments.
/\*\*

- @route PUT /comments/:id
- @description Update a comment
- @access login required
  \*/

As a user, I can delete my comments.
/\*\*

- @route DELETE /comments/:id
- @description Delete a comment
- @access login required
  \*/

As a user, I can see others comments of others user.
/\*\*

- @route GET /blogs/:id/comments
- @description Get comments of a blog
- @access login required
  \*/

/\*\*

- @route GET /comments/:id
- @description Get details of a comment
- @access login required
  \*/

### Reactions

As a user, I can like blogs
/\*\*

- @route POST /reactions
- @description Save a reaction to blog
- @access login required
- @body {blogId, type: 'like'}
  \*/
  /\*\*
- @route GET /reactions
- @description Get reaction of blog
- @access login required
- @body {blogId}
  \*/

### Follows

As a user, I can follow other users.
Or others user can follow me.
/\*\*

- @route POST /users
- @description Create a new user
- @access public
- @body {name, email, password}
  \*/

/\*\*

- @route GET /following
- @description Get the list of following user
- @access login required
  \*/

/\*\*

- @route GET /follower
- @description Get the list of follower user
- @access login required
  \*/

As a user, I can unfollow.
/\*\*

- @route DELETE /follows/:userId
- @description Unfollow a user
- @access login required
  \*/

### Subscription

As a user, I can buy subscription to create blogs.
/\*\*

- @route POST /subscription
- @description Buy subscription
- @access login required
- @body {buyerId, expiredDate}
  \*/
