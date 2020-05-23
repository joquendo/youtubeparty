var mongoose = require('mongoose');
 
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstname: String,
    lastname: String,
    facebook: {
    	id: String,
      token: String,
      email: String,
      name: String
    }
});
 
userSchema.methods.displayName = function() {
    return this.username ? this.username : this.facebook.name
};
 
userSchema.methods.profileImage = function(password) {
    return this.username ? getAnonImage() : getFacebookProfileUrl(this)
};
 
module.exports = mongoose.model('User',userSchema);
 
function getAnonImage(){
  return '/images/account_circle-24px.svg';
}
 
function getFacebookProfileUrl(user){
  return 'https://graph.facebook.com/'+ user.facebook.id + '/picture';
}