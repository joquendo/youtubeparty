var mongoose = require('mongoose');
 
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
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
  return 'https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120';
}
 
function getFacebookProfileUrl(user){
  return 'https://graph.facebook.com/'+ user.facebook.id + '/picture';
}