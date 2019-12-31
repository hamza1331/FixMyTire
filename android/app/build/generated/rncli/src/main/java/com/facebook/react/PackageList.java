
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

import com.thinksolutionz.sokhaypainday.BuildConfig;
import com.thinksolutionz.sokhaypainday.R;

// @react-native-community/geolocation
import com.reactnativecommunity.geolocation.GeolocationPackage;
// react-native-audio
import com.rnim.rn.audio.ReactNativeAudioPackage;
// react-native-firebase
import io.invertase.firebase.RNFirebasePackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-maps
import com.airbnb.android.react.maps.MapsPackage;
// react-native-sound
import com.zmxv.RNSound.RNSoundPackage;
// react-native-spinkit
import com.react.rnspinkit.RNSpinkitPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-view-pdf
import com.rumax.reactnative.pdfviewer.PDFViewPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  public PackageList(ReactNativeHost reactNativeHost) {
    this.reactNativeHost = reactNativeHost;
  }

  public PackageList(Application application) {
    this.reactNativeHost = null;
    this.application = application;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new GeolocationPackage(),
      new ReactNativeAudioPackage(),
      new RNFirebasePackage(),
      new RNGestureHandlerPackage(),
      new ImagePickerPackage(),
      new MapsPackage(),
      new RNSoundPackage(),
      new RNSpinkitPackage(),
      new VectorIconsPackage(),
      new PDFViewPackage()
    ));
  }
}
