#!/bin/env python

# Copyright 2011 Jonathan Doda
#
# This file is part of pwgen.
#
# pwgen is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License, version 3,
# as published by the Free Software Foundation.
#
# pwgen is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with pwgen. If not, see <http://www.gnu.org/licenses/>.

import hashlib
import base64
import getpass

def make_pw(master_pw, nickname, rounds=1000, length=12):
    pw = master_pw + nickname
    for i in range(0, rounds):
        hsh = hashlib.sha256()
        hsh.update(pw)
        pw = hsh.digest()
    return base64.urlsafe_b64encode(pw)[:length]
    
if __name__ == '__main__':
    master_pw = getpass.getpass('Password: ')
    master_pw2 = getpass.getpass('Confirm: ')
    if master_pw == master_pw2:
        nickname = raw_input('Nickname: ')            
        print make_pw(master_pw, nickname)
    else: 
        print "Passwords didn't match"
    
