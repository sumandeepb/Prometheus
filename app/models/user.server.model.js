/*
    Copyright (C) 2018 Sumandeep Banerjee
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* 
 * Prometheus: Online Tutorial Portal
 * Author: sumandeep.banerjee@gmail.com
 */

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String, trim: true, unique: true
    },
    email: String,
    permission: {
        type: String,
        enum: ['admin', 'editor', 'user'],
        default: 'user'
    },
    password: String,
    provider: String,
    authkey: {
        type: Schema.ObjectId,
        ref: 'AuthKey'
    },
    workshopList: {
        type: Array,
        tutorial: {
            type: Schema.ObjectId,
            ref: 'Workshop'
        }
    }
});

UserSchema.pre('save',
    function (next) {
        if (this.password) {
            var md5 = crypto.createHash('md5');
            this.password = md5.update(this.password).digest('hex');
        }
        /*else {
         next(new Error('No can do, sir!'));
         }*/
        next();
    }
);

UserSchema.methods.authenticate = function (password) {
    var md5 = crypto.createHash('md5');
    md5 = md5.update(password).digest('hex');

    return this.password === md5;
};

UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne(
        { username: possibleUsername },
        function (err, user) {
            if (!err) {
                if (!user) {
                    callback(possibleUsername);
                } else {
                    return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
                }
            } else {
                callback(null);
            }
        }
    );
};

mongoose.model('User', UserSchema);
