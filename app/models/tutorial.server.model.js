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
    Schema = mongoose.Schema;

var TutorialSchema = new Schema({
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    zipFile: {
        type: String
    },
    origFile: {
        type: String
    },
    /*startFile: {
        type: String
    },*/
    title: {
        type: String,
        default: '',
        trim: true
    },
    /*content: {
        type: String,
        default: '',
        trim: true
    },*/
    processed: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Tutorial', TutorialSchema);
