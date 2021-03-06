import {StyleSheet, Dimensions} from 'react-native';
// COLOR 1: #4a8fe7
// USED IN Router.js


//TODO: Separate Router related style to another file so that Hot Reloading starts working

//Light Blue
export const BRAND_COLOR_ONE = '#5C7AFF';
export const BRAND_COLOR_TWO = '#4A8FE7';

//Light Purple
export const BRAND_COLOR_THREE = '#845BFF';
//Dark Blue
export const BRAND_COLOR_FOUR = '#215596';

//Cyan
export const BRAND_COLOR_FIVE = '#73FBD3'

//Light version
export const BRAND_COLOR_SIX = '#98b9e3';

const { width: WIDTH } = Dimensions.get('window');

export const adourStyle = StyleSheet.create({
  listItemText: {
    fontFamily:'OpenSans',
    fontWeight:'200'
  },
  cardOverText:{
    fontFamily:'OpenSans',
    fontWeight:'200',
    alignSelf: 'center',
    marginBottom: 6,
    justifyContent: 'center'
  },
  timeAgoText: {
    fontFamily:'OpenSans',
    fontWeight:'200',
    alignSelf:'flex-end',
    marginBottom: 10,
    marginRight: 12,
    color: '#bfbfbf'
  },
  interestedText: {
    fontFamily:'OpenSans',
    fontWeight:'200',
    alignSelf:'flex-end',
    color: '#ffffff'
  },
  listItemTextBold: {
    fontFamily:'OpenSans-Semibold',
    fontWeight:'200'
  },
  listItemTextBoldB: {
    fontFamily:'OpenSans-Semibold',
    fontWeight:'400',
    fontSize: 16
  },
  fadedText: {
    fontFamily:'OpenSans',
    fontWeight:'200',
    color: '#bfbfbf',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  listItemTextBoldL: {
    fontFamily:'OpenSans',
    fontWeight:'200',
    marginTop: 8,
    fontSize: 18
  },
  fadedTextL: {
    fontFamily:'OpenSans',
    fontWeight:'200',
    fontSize: 18,
    color: '#bfbfbf',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  greyText: {
    fontFamily:'OpenSans',
    fontWeight:'200',
    color: '#bfbfbf'
  },
  defaultText: {
    fontFamily:'OpenSans',
    marginLeft: 14,
    marginBottom: 10,
    marginTop: 10,
    fontWeight:'200'
  },
  defaultTextCenter: {
    fontFamily:'OpenSans',
    marginLeft: 14,
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: 10,
    fontWeight:'200'
  },
  defaultTextSmall: {
    fontFamily:'OpenSans',
    marginLeft: 14,
    fontSize: 11,
    alignSelf: 'center',
    marginBottom: 2,
    marginTop: 5,
    color: '#545454',
    fontWeight:'200'
  },
  defaultTextSmallB: {
    fontFamily:'OpenSans',
    marginLeft: 2,
    fontSize: 11,
    alignSelf: 'center',
    marginBottom: 2,
    color: '#545454',
    fontWeight:'200'
  },
  cardText: {
    fontFamily:'OpenSans',
    marginLeft: 74,
    marginBottom: 5,
    marginTop: 5,
    fontWeight:'200'
  },
  reputationText: {
    fontFamily:'OpenSans',
    marginBottom: 10,
    marginTop: 5,
    fontSize: 16,
    alignSelf: 'center',
    fontWeight:'200'
  },
  pickerStyle: {
    marginLeft: 14,
    backgroundColor: 'rgba(54, 105, 169, 0.2)',
    marginBottom: 10,
    marginTop: 10,
    height: 45,
    width: WIDTH -108,
  },
  titleText: {
    fontFamily:'OpenSans',
    fontWeight:'200',
    fontSize: 28
  },
  titleTextCenter: {
    fontFamily:'OpenSans',
    fontWeight:'200',
    alignSelf: 'center',
    fontSize: 28
  },
  guideText: {
    fontFamily:'OpenSans-Semibold',
    fontWeight:'200',
    fontSize: 22,
    color: '#999999',
    marginBottom: 10
  },
  headerText: {
    fontFamily:'OpenSans',
    fontWeight:'200',
    fontSize: 24
  },
  buttonText: {
    fontFamily:'OpenSans'
  },
  buttonTextBold: {
    fontFamily:'OpenSans-Semibold',
  },
  logoSubtitle: {
    color: 'white',
    fontFamily:'OpenSans-Semibold',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
    opacity: 0.9
  },
  thinText: {
    color: 'white',
    fontFamily:'OpenSans',
    fontSize: 12,
    fontWeight: '200',
    marginTop: 2,
    opacity: 0.7
  },
  placeholderStyle: {
    fontFamily:'OpenSans',
    fontSize: 14,
    fontWeight: '200',
    color: 'rgba(0, 0, 0, 0.35)'
  },
  placeholderStyleMultiline: {
    fontFamily:'OpenSans',
    alignItems: 'flex-start',
    fontSize: 14,
    fontWeight: '200',
    color: 'rgba(0, 0, 0, 0.35)'
  },
  textInput: {
    height: 45,
    width: WIDTH -120,
    marginLeft: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily:'OpenSans-Semibold',
    paddingLeft: 25,
    backgroundColor: 'rgba(54, 105, 169, 0.2)',
    color: 'rgba(0, 0, 0, 0.35)'
  },
  textInputCenter: {
    height: 45,
    width: WIDTH -108,
    marginLeft: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily:'OpenSans-Semibold',
    paddingLeft: 25,
    backgroundColor: 'rgba(54, 105, 169, 0.2)',
    color: 'rgba(0, 0, 0, 0.35)',
    textAlign: 'center'
  },
  textInputLeft: {
    height: 45,
    width: WIDTH -108,
    marginLeft: 15,
    marginBottom: 15,
    fontSize: 14,
    fontFamily:'OpenSans',
    paddingLeft: 25,
    backgroundColor: 'rgba(54, 105, 169, 0.2)',
    color: 'rgba(0, 0, 0, 0.75)',
  },
  textInputLeftMultiline: {
    height: 200,
    width: WIDTH -108,
    marginLeft: 15,
    marginBottom: 15,
    fontSize: 14,
    textAlignVertical: "top",
    fontFamily:'OpenSans',
    paddingLeft: 25,
    paddingTop: 10,
    paddingRight: 15,
    backgroundColor: 'rgba(54, 105, 169, 0.2)',
    color: 'rgba(0, 0, 0, 0.75)',
  },
  textInputMultilineSmall: {
    height: 120,
    width: WIDTH -108,
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 15,
    fontSize: 14,
    textAlignVertical: "top",
    fontFamily:'OpenSans',
    paddingLeft: 25,
    paddingTop: 10,
    paddingRight: 15,
    backgroundColor: 'rgba(54, 105, 169, 0.2)',
    color: 'rgba(0, 0, 0, 0.75)',
  },
  bioInputCenter: {
    height: 100,
    width: WIDTH -108,
    marginLeft: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily:'OpenSans-Semibold',
    paddingLeft: 25,
    backgroundColor: 'rgba(54, 105, 169, 0.2)',
    color: 'rgba(0, 0, 0, 0.35)',
    textAlign: 'left'
  },
  picker: {
    fontFamily:'OpenSans-Semibold',
    paddingLeft: 25,
    backgroundColor: 'rgba(54, 105, 169, 0.5)',
    color: 'rgba(255, 255, 255, 0.9)'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: BRAND_COLOR_ONE,
    overflow: 'hidden'
  },
  onboardingSubtitle: {
    fontFamily:'OpenSans-Semibold',
    color: 'white',
    fontSize: 14,
    fontWeight: '200'
  },
  onboardingTitle: {
    fontFamily:'OpenSans',
    fontWeight:'200',
    fontSize: 35
  },
  cardTitle: {
    fontFamily:'OpenSans',
    fontWeight:'200',
    fontSize:20,
    marginLeft: 18,
    textAlign:'left',
  },
  cardTitleSmall: {
    fontFamily:'OpenSans-Semibold',
    fontWeight:'200',
    fontSize:16,
    marginLeft: 18,
    textAlign:'left',
  },
  cardSubtitle: {
    fontFamily:'OpenSans',
    fontSize: 16,
    fontWeight: '100',
    marginBottom: 8
  },
  btnGeneral: {
    borderRadius: 25,
    height: 45,
    backgroundColor: BRAND_COLOR_TWO,
    justifyContent: 'center',
    marginTop: 20
  },
  btnShare: {
    borderRadius: 5,
    height: 35,
    backgroundColor: BRAND_COLOR_SIX,
    justifyContent: 'center',
    marginTop: 20
  },
  btnRewind: {
    borderRadius: 5,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 4,
    marginRight: 4,
    height: 35,
    backgroundColor: '#ebebeb',
    justifyContent: 'center',
  },
  btnHomeHost: {
    borderRadius: 5,
    height: 45,
    backgroundColor: BRAND_COLOR_TWO,
    justifyContent: 'center',
    marginTop: 15
  },
  btnGeneralT: {
    borderRadius: 25,
    height: 45,
    backgroundColor: BRAND_COLOR_TWO,
    justifyContent: 'center',
    marginTop: 10
  },
  redButton: {
    borderRadius: 15,
    height: 45,
    backgroundColor: 'indianred',
    justifyContent: 'center',
    marginTop: 20
  },
  textWhite: {
    color: 'white',
    fontFamily:'OpenSans-Semibold',
    fontSize: 16,
    fontWeight: '200',
    marginLeft: 5,
    marginRight: 5
  },
  btnGeneralBadge: {
    borderRadius: 25,
    height: 45,
    width: WIDTH -120,
    backgroundColor: BRAND_COLOR_TWO,
    justifyContent: 'center',
    marginTop: 20
  },
  btnCancel: {
    borderRadius: 25,
    height: 45,
    backgroundColor: '#85A2C5',
    justifyContent: 'center',
    marginTop: 20
  },
  btnText: {
    fontFamily:'OpenSans',
    fontWeight:'200',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 16,
    textAlign: 'center'
  },
  btnTextRewind: {
    fontFamily:'OpenSans-Semibold',
    fontWeight:'200',
    color: BRAND_COLOR_ONE,
    fontSize: 14,
    textAlign: 'center'
  },
  btnTextSmall: {
    fontFamily:'OpenSans-Semibold',
    fontWeight:'200',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 14,
    textAlign: 'center'
  },
  textInputForFilter: {
    height: 45,
    width: WIDTH -30,
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 5,
    fontSize: 14,
    fontFamily:'OpenSans',
    paddingLeft: 25,
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'rgba(0, 0, 0, 0.75)',
  },
  moreInfoButton: {
    borderRadius: 5,
    height: 35,
    backgroundColor: BRAND_COLOR_SIX,
    justifyContent: 'center',
    marginTop: 10,
    width: WIDTH -110,
    alignSelf: 'center',
  }

})
