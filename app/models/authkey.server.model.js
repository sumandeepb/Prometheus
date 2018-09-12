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

var AuthKeySchema = new Schema({
    value: {
        type: String, trim: true, unique: true
    },
    permission: {
        type: String,
        enum: ['editor', 'user'],
        default: 'user'
    },
    used: {
        type: Boolean,
        default: false
    },
    useCount: {
        type: Number,
        default: 0
    },
    useLimit: {
        type: Number,
        default: 1
    },
    workshop: {
        type: Schema.ObjectId,
        ref: 'Workshop'
    }
});

mongoose.model('AuthKey', AuthKeySchema);
