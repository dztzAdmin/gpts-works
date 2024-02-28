import { NextRequest, NextResponse } from "next/server";
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
 
let locales = ['en-US', 'nl-NL', 'nl']
 
// Get the preferred locale, similar to the above or using a library
function getLocale(request:NextRequest) {

    let headers = { 'accept-language': 'en-US,en;q=0.5' }
    let languages = new Negotiator({ headers }).languages()
    console.log(languages,'Negotiator')
    let locales = ['en-US', 'nl-NL', 'nl']
    let defaultLocale = 'en-US'
     
    return match(languages, locales, defaultLocale) // -> 'en-US'
 }
 
 import createMiddleware from 'next-intl/middleware';
 
 export default createMiddleware({
   // A list of all locales that are supported
   locales: ['en', 'de'],
  
   // Used when no locale matches
   defaultLocale: 'en'
 });
  
 export const config = {
   // Match only internationalized pathnames
   matcher: ['/', '/(de|en)/:path*']
 };