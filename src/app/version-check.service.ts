import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class VersionCheckService {
  // this will be replaced by actual hash post-build.js
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
  constructor(private http: HttpClient) { }
  /**
  * Checks in every set frequency the version of frontend application
  * @param url
  * @param {number} frequency - in milliseconds, defaults to 30 minutes
  */
  public initVersionCheck(url, frequency = 5000) {
    setInterval(() => {
      this.checkVersion(url);
    }, frequency);
    this.checkVersion(url);
  }
  /**
  * Will do the call and check if the hash has changed or not
  * @param url
  */
  private checkVersion(url) {
    // timestamp these requests to invalidate caches
    this.http.get(url + '?t=' + new Date().getTime())
      .subscribe(
        (response: any) => {
          const hash = response.hash;
          const hashChanged = this.hasHashChanged(this.currentHash, hash);
          // If new version, do something
          if (hashChanged) {
            console.log('change')
            window.location.reload();
            // ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
            // for an example: location.reload();
          }
          // store the new hash so we wouldn't trigger versionChange again
          // only necessary in case you did not force refresh
          this.currentHash = hash;
        },
        (err) => {
          console.log(22, 'Could not get version')
        }
      );
  }
  /**
  * Checks if hash has changed.
  * This file has the JS hash, if it is a different one than in the version.json
  * we are dealing with version change
  * @param currentHash
  * @param newHash
  * @returns {boolean}
  */
  private hasHashChanged(currentHash, newHash) {
    if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false;
    }
    return currentHash !== newHash;
  }
}
// https://medium.com/@aakashbumiya/auto-reload-for-clients-after-deploy-with-angular-7-production-build-bdc45be9b2bd