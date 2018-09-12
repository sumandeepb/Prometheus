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

var WorkshopSchema = new Schema({
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: false
    },
    title: {
        type: String
    },
    company: {
        type: String
    },
    location: {
        type: String
    },
    tutorialList: {
        type: Array,
        tutorial: {
            type: Schema.ObjectId,
            ref: 'Tutorial'
        }
    }
});

mongoose.model('Workshop', WorkshopSchema);