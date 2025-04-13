const gyroscope = {
  
    //sensor refresh rate 1/60
    rotateDisplay: 0,
    leftToRight: 0,
    frontToBack:0,
    movementTowardsToAway: 0,
    movementLeftToRight: 0,
    movementUpToDown: 0,
    
    //
    // DeviceOrientationEvent
    //
      
    requestDeviceOrientation: function() {
        if (
            typeof DeviceOrientationEvent !== "undefined" &&
            typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
            DeviceOrientationEvent.requestPermission()
                .then((permissionState) => {
                    if (permissionState === "granted") {
                        //what to do with gyroscope: >IOS13
                        gyroscope.getOrientationData();
                    }
                })
                .catch(console.error);
        } else {
            //what to do with gyroscope: other devices
            gyroscope.getOrientationData();
        }
    },
    
    
    //
    // DeviceMotionEvent
    //
    
    requestDeviceMotion: function() {
        if (
            typeof DeviceMotionEvent !== "undefined" &&
            typeof DeviceMotionEvent.requestPermission === "function"
        ) {
            DeviceMotionEvent.requestPermission()
                .then((permissionState) => {
                    if (permissionState === "granted") {
                        //what to do with gyroscope: >IOS13
                        gyroscope.getMotionData();
                    }
                })
                .catch(console.error);
        } else {
            //what to do with gyroscope: other devices
            gyroscope.getMotionData();
        }
    },
    
    
    
    // ---------------
    
    getOrientationData: function() {
      window.addEventListener("deviceorientation", (event) => {
          gyroscope.rotateDisplay = event.alpha;
          gyroscope.frontToBack = event.beta;
          gyroscope.leftToRight = event.gamma;
          // updateGyroscope();
      });
    },
    getMotionData: function() {
      window.addEventListener("devicemotion", (event) => {
        gyroscope.movementTowardsToAway = event.acceleration.z;
        gyroscope.movementLeftToRight = event.acceleration.x;
        gyroscope.movementUpToDown = event.acceleration.y;
          // updateGyroscope();
      });
    }
    }
    export{gyroscope};