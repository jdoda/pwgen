#!/bin/env python

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
    
