import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getAuth
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from "firebase/firestore";


//user context to provide access to overarching app context such as user information and general request

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [userInfo, setUserInfo] = useState();


    //create a new user
    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    //sign in of an existing user
    const signIn = (email, password) =>  {
        return signInWithEmailAndPassword(auth, email, password)
    }

   //logout current user
    const logout = () => {
        return signOut(auth)
    }

    //get the current signed in user on mount
    useEffect(() => {
        setUser(getAuth().currentUser);
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log(currentUser);
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    //if user id exists then we make a request to obtain the user information from the database for additional user data
    useEffect(() => {
        if (user){
            const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
                console.log(doc);
                setUserInfo(doc);
            });
            return () => {
                unsub();
            };
        }
    }, [user]);


  return (
        <UserContext.Provider value={{ createUser, user, userInfo, logout, signIn }}>
            {children}
        </UserContext.Provider>
  );
};

export const UserAuth = () => {
    return useContext(UserContext);
};