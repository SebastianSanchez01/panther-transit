import { View, Text, StyleSheet, Pressable, Image, Platform, TouchableOpacity, Animated, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { useAppTheme } from '@/hooks/useAppTheme';

const { width } = Dimensions.get('window');

// Light mode background colors
const lightBgColors = ['#E8F4FD', '#f9b9bf', '#FFF6E9', '#EFF8F1'];

// Dark mode background colors - darker shades of the light colors
const darkBgColors = ['#142c42', '#3d2326', '#2d251c', '#1d2f20'];

export default function HomeScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { isDarkMode, colors } = useAppTheme();
  
  // Select the appropriate background colors based on the theme
  const bgColors = isDarkMode ? darkBgColors : lightBgColors;
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const textPositionY = useRef(new Animated.Value(50)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const dotPosition = Animated.divide(scrollX, width);

  useEffect(() => {
    // Start the welcome animation
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 800,
          useNativeDriver: true,
        }),

        Animated.timing(textPositionY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),

        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After text animation, begin fade out of splash overlay
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setShowSplash(false);
          });
        }, 1000);
      });
    }, 800);
  }, []);

  // Function for page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollViewRef.current?.scrollTo({ x: page * width, animated: true });
  };

  const backgroundColor = scrollX.interpolate({
    inputRange: [0, width, width * 2],
    outputRange: [bgColors[0], bgColors[1], bgColors[2]],
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    setCurrentPage(page);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header with menu button */}
      {!showSplash && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            <Ionicons name="menu" size={30} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Sidebar menu */}
      {menuOpen && (
        <View style={[styles.sidebar, { backgroundColor: isDarkMode ? colors.card : '#E8F4FD' }]}>
          <Pressable style={styles.closeButton} onPress={() => setMenuOpen(false)}>
            <Ionicons name="close" size={30} color={colors.primary} />
          </Pressable>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => {
              router.push('/(menu)/alerts');
              setMenuOpen(false);
            }}
          >
            <Ionicons name="warning-outline" size={24} color={colors.primary} style={styles.menuIcon} />
            <Text style={[styles.menuItem, { color: colors.primary }]}>Alerts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => {
              router.push('/(menu)/settings');
              setMenuOpen(false);
            }}
          >
            <Ionicons name="settings-outline" size={24} color={colors.primary} style={styles.menuIcon} />
            <Text style={[styles.menuItem, { color: colors.primary }]}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => {
              router.replace('../');
              setMenuOpen(false);
            }}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.primary} style={styles.menuIcon} />
            <Text style={[styles.menuItem, { color: colors.primary }]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Splash Screen Elements */}
      {showSplash ? (
        <Animated.View style={[
          styles.splashContainer,
          { 
            opacity: fadeAnim,
            backgroundColor: isDarkMode ? '#0c1825' : '#E8F4FA'
          }
        ]}>
          <Animated.Text style={[
            styles.splashText,
            {
              opacity: textOpacity,
              color: colors.primary,
              transform: [
                { scale: scaleAnim },
                { translateY: textPositionY }
              ]
            }
          ]}>
            Welcome to Panther Transit!
          </Animated.Text>
          
          <Animated.View style={[styles.splashLogo, { opacity: textOpacity }]}>
            <Image
          source={require('../../assets/images/gsu-panther.png')} 
          style={{ width: 100, height: 90 }} />
          </Animated.View>
        </Animated.View>

      ) : (
        // Swipeable content
        <Animated.View style={[styles.pageContainer, { backgroundColor }]}>
          <Animated.ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
          >
            {/* Page 1: Safety Tips */}
            <View style={styles.page}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Safety Tips & Information</Text>
              <View style={[styles.contentCard, { 
                backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)' 
              }]}>
                <Text style={[styles.subtitle, { color: isDarkMode ? colors.text : '#444' }]}>• Be aware of your surroundings and report suspicious activity.</Text>
                <Text style={[styles.subtitle, { color: isDarkMode ? colors.text : '#444' }]}>• Call GSU Police at (404) 413-2100 if you notice anything unusual.</Text>
                <Text style={[styles.subtitle, { color: isDarkMode ? colors.text : '#444' }]}>• Use the GSU LiveSafe App or Campus Crime Stoppers at 404-577-TIPS to submit tips.</Text>
                <Text style={[styles.subtitle, { color: isDarkMode ? colors.text : '#444' }]}>• Request a safety escort on campus by calling (404) 413-2100.</Text>
                <Text style={[styles.subtitle, { color: isDarkMode ? colors.text : '#444' }]}>• Contact Crime Prevention at (404) 413-3213 for safety programs and tips.</Text>
              </View>
              <Text style={[styles.swipeText, { color: colors.primary }]}>Swipe →</Text>
            </View>

            {/* Page 2: Emergency Contacts */}
            <View style={styles.page}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Emergency Contacts</Text>
              <View style={[styles.contentCard, { 
                backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)' 
              }]}>
                <Text style={[styles.subtitle, { color: isDarkMode ? colors.text : '#444' }]}>• In case of emergency, CALL 911</Text>
                <Text style={[styles.subtitle, { color: isDarkMode ? colors.text : '#444' }]}>• GSU Police Department: (404) 413-3333</Text>
                <Text style={[styles.subtitle, { color: isDarkMode ? colors.text : '#444' }]}>• GSU Emergency: (404) 413-2100</Text>
                <Text style={[styles.subtitle, { color: isDarkMode ? colors.text : '#444' }]}>• MARTA Customer Service: (404) 848-5000</Text>
                <Text style={[styles.subtitle, { color: isDarkMode ? colors.text : '#444' }]}>• Safe Ride (GSU Escort Service): (404) 413-2100</Text>
                <Text style={[styles.subtitle, { color: isDarkMode ? colors.text : '#444' }]}>• Email: police@gsu.edu</Text>
              </View>
              <Text style={[styles.swipeText, { color: colors.primary }]}>Swipe →</Text>
            </View>

            {/* Page 3: Safe travels message */}
            <View style={styles.page}>
              <View style={[styles.contentCard, { 
                backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)' 
              }]}>
                <Text style={[styles.welcomeMessage, { color: colors.primary }]}>Panther Transit</Text>
                <Text style={[styles.messageTitle, { color: colors.primary }]}>Wishes You Safe Travels</Text>
                <Ionicons name="heart" size={60} color={isDarkMode ? "#ff5c5c" : "#D22B2B"} style={styles.heartIcon} />
                <Text style={[styles.subtitle, { color: isDarkMode ? colors.text : '#444' }]}>Your safety is our priority.</Text>
                <Text style={[styles.subtitle, { color: isDarkMode ? colors.text : '#444' }]}>Thank you for using Panther Transit!</Text>
              </View>
              <Text style={[styles.swipeText, { color: colors.primary }]}>← Swipe to return</Text>
            </View>
          </Animated.ScrollView>

          {/* Pagination dots */}
          <View style={styles.paginationContainer}>
            {[0, 1, 2].map(idx => {
              const opacity = dotPosition.interpolate({
                inputRange: [idx - 1, idx, idx + 1],
                outputRange: [0.3, 0.9, 0.3],
                extrapolate: 'clamp'
              });
              
              const scale = dotPosition.interpolate({
                inputRange: [idx - 1, idx, idx + 1],
                outputRange: [0.8, 1.4, 0.8],
                extrapolate: 'clamp'
              });
              
              return (
                <TouchableOpacity 
                  key={idx} 
                  onPress={() => handlePageChange(idx)}
                >
                  <Animated.View 
                    style={[
                      styles.paginationDot, 
                      { 
                        backgroundColor: colors.primary,
                        opacity, 
                        transform: [{ scale }] 
                      }
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Header and menu styles
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#E8F4FD',
    padding: 20,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  menuItem: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#0039A6',
  },
  menuIcon: {
    marginRight: 10,
  },
  
  // Splash screen styles
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F4FA',
  },
  splashText: {
    fontSize: 32,
    fontFamily: 'Montserrat-Bold',
    color: '#0039A6',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  splashLogo: {
    marginTop: 40,
  },
  
  // Page styles
  pageContainer: {
    flex: 1,
  },
  page: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#0039A6',
    textAlign: 'center',
    marginBottom: 20,
  },
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#444',
    marginBottom: 10,
  },
  swipeText: {
    marginTop: 30,
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#0039A6',
    opacity: 0.8,
  },
  
  // Message page specific styles
  welcomeMessage: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#0039A6',
    textAlign: 'center',
  },
  messageTitle: {
    fontSize: 26,
    fontFamily: 'Montserrat-Bold',
    color: '#0039A6',
    textAlign: 'center',
    marginBottom: 20,
  },
  heartIcon: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  
  // Pagination styles
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: '#0039A6', // This color will be overridden by the animated style
  },
});