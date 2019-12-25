import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import colors from '../constants/Colors';
import Header from '../components/Header';

class TermsAndConditionsScreen_en extends React.Component {

  constructor (props) { 
  	super(props); 
  }

  render () {

    return (

<View style={styles.container}>

<ScrollView
  showsVerticalScrollIndicator={false}
  overScrollMode={'always'}
>

<Text style={[styles.text2, {paddingTop: 90}]}>Terms of Use</Text>

<Text style={styles.text3}>Last Revised: 3:58 PM, PST, July 26, 2019</Text>

<Text style={styles.text3}>Please carefully read the following Terms of Use ("Terms") before using the Blockdoc web site or mobile application (collectively the "Service"). By accessing and using this Service, you acknowledge that you have read, understood and agree to be bound by these Terms which form an agreement that is effective as if you had signed it. If at any time you do not agree to these Terms, please do not access or use this Service or any of its content.</Text>

<Text style={styles.text3}>YOUR USE OF THE MOBILE APP AND ACCESS TO, USE OF, AND BROWSING OF THE SITE AND ITS CONTENTS ARE SUBJECT TO ALL TERMS OF USE CONTAINED HEREIN AND ALL APPLICABLE LAWS AND REGULATIONS. IF YOU DO NOT AGREE TO THESE TERMS OF USE, YOUR PERMISSION TO ACCESS OR USE THE MOBILE APP AND SITE IS AUTOMATICALLY AND IMMEDIATELY REVOKED.</Text>

<Text style={styles.text2}>1. Definitions</Text>

<Text style={styles.text3}><Text style={styles.bf}>"Health information"</Text> means: (i) information about your health which is provided to us by our Partners, including results of tests that they have conducted based on information and samples that you have or have authorised to be provided to them; (ii) information regarding your genotype, generated through processing by our Partners; (iii) any information about yourself that is not contact information, including your disease conditions, other health-related information, personal traits, ethnicity, and other information that you enter into surveys, forms or features or other methods of input on the Blockdoc platform or to our Partners.</Text>

<Text style={styles.text3}><Text style={styles.bf}>"Partners"</Text> means third parties who conduct the business of processing Health Information, with whom we enter into agreements with and rely upon to provide the Service to you. Such third parties may include providers of genome or blood testing services.</Text>

<Text style={styles.text3}><Text style={styles.bf}>"Providers"</Text> means third parties through whom Healthblock's Services are offered to you, with whom we enter into agreements with. Such third parties may include hospitals, health maintenance organisations and registered medical practitioners. Some Providers may also be our Partners.</Text>

<Text style={styles.text3}><Text style={styles.bf}>"Results"</Text> means information that we provide to you which arises out of or in connection with our processing of your Health Information.</Text>

<Text style={styles.text3}><Text style={styles.bf}>"Sample Collection Kit"</Text> means the devices packaged as a "Sample Collection Kit" that we, our Partners or the Providers may provide to you for the purpose of collecting a blood sample by which Health Information is generated.</Text>

<Text style={styles.text3}><Text style={styles.bf}>"Service"</Text> means the Blockdoc platform and related products, software, services, mobile application and website (including but not limited to text, graphics, images and other material and information) as accessed from time to time by you, regardless of whether you do so in connection with a registration or not. Without limitation to the foregoing, Services also include: (i) processing and analysing any Health Information; (ii) providing access to the Blockdoc platform; (iii) uploading a digital version of Health Information, and providing it for interaction on the Blockdoc platform.</Text>

<Text style={styles.text3}><Text style={styles.bf}>"Terms of Use"</Text> means these Terms of Use as updated from time to time.</Text>

<Text style={styles.text3}><Text style={styles.bf}>"We"</Text> means Healthblock Inc. (530 Lytton Ave., Suite 230, 94301 Palo Alto, California, U.S.A.) and Healthblock Hong Kong Limited (Level 12, BOC Group Life Assurance Tower, 136 Des Voeux Road Central, Hong Kong) and <Text style={styles.bf}>"us"</Text> or <Text style={styles.bf}>"our"</Text> or <Text style={styles.bf}>"Healthblock"</Text> shall have the same meaning.</Text>

<Text style={styles.text3}><Text style={styles.bf}>"You"</Text> means the person accessing or using or attempting to access or use the Service (and <Text style={styles.bf}>"your"</Text> shall have the same meaning).</Text>

<Text style={styles.text2}>2. General</Text>

<Text style={styles.text3}>The Services are intended to be used by persons located in Hong Kong only. By registering to access, use, or accessing or using the Service, you agree to be bound by the Terms of Use. If you do not agree to all of the terms of these Terms of Use you should not register to access, use or attempt to access or use the Service. Do not use the Services if you are not of legal age to form a binding contract with us, or if any applicable laws would prevent your Health Information from being provided to us or our Partners.</Text>

<Text style={styles.text2}>3. Changes of Terms</Text>

<Text style={styles.text3}>These Terms may be revised or updated from time to time. Accordingly, you should check the Terms regularly for updates. You can determine when the Terms were last revised by referring to the "Last Revised" legend at the top of this page. Any changes in these Terms take effect upon posting and will only apply to use of the Mobile App and Site after that date. Each time you use the Mobile App or access, use, or browse the Site, you signify your acceptance of the then-current Terms.</Text>

<Text style={styles.text2}>4. Security</Text>

<Text style={styles.text3}>The security of your Health Information and your Results is of paramount importance. As such, we employ software, hardware and physical security measures to protect our systems where your Health Information and your Results are processed and stored, such as end-to-end encryption. Please see our Privacy Policy (at https://www.blockdoc.com/privacy.html) for more details.</Text>

<Text style={styles.text2}>5. Risks and Considerations</Text>

<Text style={styles.text3}>Please consider and understand the following risks that you will take on when using the Service:</Text>

<Text style={styles.text3}><Text style={styles.bf}>Please do not act on any information that we provide to you unless and until you have sought the advice of a qualified medical practitioner.</Text> The Service and the Results are meant to supplement and assist the work of qualified medical practitioners, and are not meant under any circumstances to replace the work that such qualified medical practitioners do, and in particular the medical advice that they are qualified to give. We do not endorse, warrant or guarantee the effectiveness of any specific course of action, resources, tests, physician or other health care providers, drugs, biologics, medical devices or other products, procedures, or opinions. If you feel that any information (including the Results) we provide to you is actionable, please understand that such information is for informational purposes only and meant for discussion with a qualified medical practitioner.</Text>

<Text style={styles.text3}>You should not assume that any information we may be able to provide to you will be welcomed or positive. Such information may evoke strong emotions and have the potential to lead to changes in your living habits or in your daily routines, as they may review information about your health that you were not previously aware of.</Text>

<Text style={styles.text3}>If the information we provide indicates that you are not at an elevated risk for a particular disease or condition, this does not mean you should feel protected from the risk. Likewise, if the information we provide indicates that you are at an elevated risk for a particular disease or condition,  this does not mean you will definitely develop the disease or condition. Please consult a qualified medical practitioner in relation to any health concerns.</Text>

<Text style={styles.text3}>The Health Information we receive is processed by our Partners in the first instance. We rely on our Partners to ensure that the information is accurate to the extent possible given the current state of the art in the technology used, and do not have capabilities to verify the accuracy of Health Information ourselves. We are not liable for any loss or damage you may suffer or incur which is caused by or contributed to by the accuracy of the Health Information we receive.</Text>

<Text style={styles.text3}>Please use caution in sharing any of your Results with others, as your Results might in some circumstances be used against your interests. Some jurisdictions may provide legal protections on discrimination based on health or biometric data, but this is not universally so. You may wish to consult a lawyer to understand the legal protections available to you before sharing your Results. Furthermore, please note that Results that you choose to share with a registered medical practitioner or other health care provider may become part of your medical record, and, potentially, be accessible by other health care providers and/or insurance companies in the future. If you are asked by an insurance company regarding any health conditions and you do not disclose any such material information to them where it exists, this may be considered to be fraud.</Text>

<Text style={styles.text2}>6. Proprietary Rights and Licence</Text>

<Text style={styles.text3}><Text style={styles.bf}>Our rights</Text>. All trade marks, copyright, database rights, and other intellectual property rights of any nature and in any part of the world in the Service together with the underlying software code are owned directly either by us or by our licensor(s). We hereby grant to you a worldwide, non-exclusive, non-transferrable, royalty-free and revocable licence to use the Service for your personal use in accordance with these Terms of Use. You acknowledge and agree that: (i) your use of the Services do not entitle you to any rights in any research or commercial products that we or our collaborating partners may further develop. In particular, you acknowledge and agree that that you will not receive compensation for any research or commercial products even if they were developed from the use of your Health Information; and (ii) you will not, nor will you allow third parties on your behalf to make and distribute copies of the Service; attempt to copy, reproduce, alter, modify, adapt, reverse engineer, disassemble, decompile, transfer, exchange, or translate the Service; or create derivative works of the Service of any kind whatsoever.</Text>

<Text style={styles.text3}><Text style={styles.bf}>Your rights</Text>. To the extent that you have ownership over any information, data, text, audio, photographs, graphics, video, messages, or other materials and Health Information (together, <Text style={styles.bf}>"User Information"</Text>) that you provide to us for the purpose of using the Service, you retain such ownership. You also retain ownership of the Results. You hereby grant us (or will procure for us) a worldwide, non-exclusive, royalty-free, transferrable and irrevocable licence to use, reproduce, adapt, modify, translate, or sub-licence such User Information and the Results to provide the Service to you.</Text>

<Text style={styles.text2}>7. Conditions of Use</Text>

<Text style={styles.text3}><Text style={styles.bf}>You represent that you understand that information (including the Results) provided to you pursuant to the Service is not designed to independently diagnose, prevent, or treat any condition or disease or to ascertain the state of your health in the absence of medical and clinical information. You understand that the Service and the Results are intended for research, informational and educational purposes only, and that if the information (including the Results) provided appear to point to a risk, diagnosis, or treatment, it should always be confirmed and supplemented by additional medical and clinical testing. You acknowledge that our recommendation is always for you to seek the advice of a registered medical practitioner if you have questions or concerns arising from information that is provided to you.</Text></Text>

<Text style={styles.text3}>You represent that you give permission to us and our Partners to perform genotyping services and process samples that you have provided to us via the Sample Collection Kit and you specifically request us to disclose the Results to you and to others you specifically authorise.</Text>

<Text style={styles.text3}>You represent that you are not an insurance company or an employer attempting to obtain information about a person who is or may be insured by you, or is an employee.</Text>

<Text style={styles.text3}>You must not, and must not attempt to: use the Service to send or receive electronic communications, which are defamatory, threatening or which could be classed as harassment; contain obscene, profane or abusive language or material; contain pornographic material (that is text, pictures, images, films, sound or video clips of a sexually explicit or arousing nature); contain offensive or derogatory material including those regarding sex, race, religion, colour, origin, age, physical or mental disability, medical condition and/or sexual orientation; constitute stalking or harassment to any persons; in our reasonable opinion may adversely affect the manner in which we carry out our business; advertise or offer to sell or buy any goods or services for any business purposes; constitute unsolicited or unauthorised advertising, promotional materials, junk mail, spam, chain letters, pyramid schemes, or any other form of solicitation; or are otherwise unlawful, improper, inappropriate or immoral; provide us, our Partners or the Providers with any blood samples which are not your own; use the Sample Collection Kit other than in accordance with its intended purpose; infringe any third party's rights (including intellectual property rights); impersonate any person or entity, including anyone affiliated with us, or falsely state or otherwise misrepresent your affiliation with a person or entity; add your own headers, forge headers or otherwise manipulate identifiers to disguise the origin of any content transmitted through the Service; use any information received through the Service to attempt to identify other customers, to contact other customers, or for any forensic use; download any file posted by another user of the Service that you know, or reasonably should know, cannot be legally distributed in such a manner; use manual or automated software, devices, scripts, robots, or other means or processes to access, scrape, craw or spider the Service; engage in framing, mirroring, or otherwise simulating the appearance or function of our Service; introduce to the Service viruses, trojans, worms, logic bombs or other material which is malicious or technologically harmful; gain unauthorized access to the Service or the server on which the Service is based nor any server, computer or database connected to the Service; damage, disable, overburden, impair, interfere with or disrupt the Service or servers or networks connected to the Service, or interfere with any other party's use and enjoyment of the Services; override any security component of the Service; or engage in any activity which constitutes or is capable of constituting a criminal offence, either in Hong Kong or in any country throughout the world.</Text>

<Text style={styles.text3}>Music, video, pictures, text and other content on the internet are copyrighted works and you should not download, alter, e-mail or otherwise use such content unless you are certain that the owner of such works has authorized its use by you.</Text>

<Text style={styles.text3}>As the Services are intended to be used by persons located in Hong Kong only and we do not verify on an individual basis where you are located, you represent that you are located in Hong Kong at the time of using the Services.</Text>

<Text style={styles.text3}>You will be assumed to have obtained permission from the owners of any devices that are controlled, but not owned, by you to use the Service (together with devices owned by you to use the Service) (the <Text style={styles.bf}>"Devices"</Text>). You accept responsibility in accordance with the terms of these Terms of Use for the use of the Service on or in relation to any Devices, whether or not it is owned by you.</Text>

<Text style={styles.text3}>By using the Service, you consent to us collecting and using technical information about the Devices and related software, hardware and peripherals for services to improve our products and services and to provide the Service to you.</Text>

<Text style={styles.text3}>The Service may contain links to other independent third-party content (<Text style={styles.bf}>"Third-party Content"</Text>). Unless stated otherwise in these Terms of Use, Third-party Content is not under our control, and we are not responsible for, and do not endorse, their content or their privacy policies (if any). You will need to make your own independent judgment regarding your interaction with any Third-party Content, including the purchase and use of any products or services accessible through them.</Text>

<Text style={styles.text2}>8. Membership Registration</Text>

<Text style={styles.text3}>You can register for the use of the Service by using the Blockdoc application on your Device to scan the QR code located on the QR code key card in the sample collection kit. </Text>

<Text style={styles.text3}>Payment for membership and, correspondingly, for the use of our Services, is collected and processed on our behalf by the Providers. You are solely responsible for any such payments and we reserve the right to terminate our Services to you in the event that you fail to make such payments. </Text>

<Text style={styles.text3}>You are solely responsible for maintaining the confidentiality of your password and the security of your QR code. You are fully responsible for any and all activities that occur under your password or QR code. If you allow third parties to access the Service through your password or QR code, you indemnify us against any loss or damage suffered or incurred by us as a result of such third parties accessing and/or using the Services through your password or QR code. You must immediately notify us of any unauthorised use of your password or username or any other security breach, and also promptly log out at the end of each session. We are not liable under any circumstances whatsoever for any loss or damage suffered or incurred by you arising out of or in connection with your failure to comply with this clause.</Text>

<Text style={styles.text3}>Two types of membership may be made available: standard membership or premium membership. The Providers may offer you the choice of either standard membership or premium membership, or may instead have pre-selected standard membership or premium membership for you. In either event, please check carefully which type of membership you are entitled to so that you understand which of the following provisions apply to you:</Text>

<Text style={styles.text3}><Text style={styles.bf}>Standard membership</Text>: if your membership is a standard membership, then as part of your Results you are entitled to one report per Sample Collection Kit used. The report will only provide information on cardiovascular risk.</Text>

<Text style={styles.text3}><Text style={styles.bf}>Premium membership</Text>: if your membership is a premium membership, then as part of your Results you are entitled to more than one report per Sample Collection Kit used. While the first report we deliver to you will only provide information on cardiovascular risk, we may make available to you from time to time further reports which may provide further information as and when they become available. Please note that our Providers are entitled to and reserve the right to charge you for additional payment for each further report should such reports be made available to you.</Text>

<Text style={styles.text2}>9. Third Parties</Text>

<Text style={styles.text3}>We rely on and cooperate with third parties to provide or enhance the Services. To provide the Services, we acquire your Health Information from our Partners, for the purpose of processing such Health Information to generate Results that are presented to you via the Heathblock platform.</Text>

<Text style={styles.text3}>We may share your Results and Health Information with third parties where you have specifically authorised us to do so. For example, we may provide you with an option to allow you authorise us to share your Results and Health Information to a registered medical practitioner of your choice. In such a case we would share your results and Health Information with that registered medical practitioner. You are responsible for all possible consequences resulting from your sharing (or authorising us to share) with others access to your Results and Health Information.</Text>

<Text style={styles.text3}>Third parties (such as registered medical practitioners you have chosen to contact via our Service) may also provide content to you via the Services. We do not control the content provided to you by third parties at all times, and do not guarantee the accuracy, integrity or quality of such third-party content. We are not liable for any loss or damage you may suffer arising from such third-party content, including any errors or omissions in such content.</Text>

<Text style={styles.text2}>10. Personal Information Collection Statement</Text>

<Text style={styles.text3}>The Service will only be accessible to you when you connect to the Service by completing an online registration form and submission of your Health Information to our Partners. By doing so, you agree that we may obtain personal data from you including your profile ID, name, gender, birthday, age, phone number, language used, email address and biometric data such as blood samples.</Text>

<Text style={styles.text3}>The personal data and other information (collectively, "Data") provided by you as a result of or in connection with the Service are collected, used and retained by us in accordance with the requirements in the Personal Data (Privacy) Ordinance and our Privacy Policy (available at https://www.blockdoc.com/privacy.html). Your failure to provide any Data that is marked as mandatory may mean that we cannot provide you with the Service. Our Privacy Policy may change from time to time, which provisions are incorporated into these Terms of Use by reference and apply to the Service. </Text>

<Text style={styles.text3}>The applicable terms and conditions of the Service and our Privacy Policy will apply to and govern why the Data is collected, how the Data is used and maintained and to whom it is disclosed. The Data is collected, may be used, processed or maintained by and/or disclosed to our affiliates or related companies, agents and business partners, the said third party provider(s) (that may include third party data processors), and applicable regulatory or governmental authorities (at all times to the extent permissible under applicable laws, licences, rules and regulations) for the purpose of providing the Service. In particular, we need to provide Data to our Partners so as to ensure we process the correct Health Information and provide the correct Results to you.</Text>

<Text style={styles.text3}>Requests for accessing or correction of your Data held by us or any enquiry about such Data can be made in writing to our Privacy Compliance Officer at support@blockdoc.com. When making a request or an enquiry, please provide us with your anonymous user id (which can be accessed in the mobile app's Account' tab) so that we are able to identify your request or enquiry and respond appropriately.</Text>

<Text style={styles.text2}>11. Use of The Service</Text>

<Text style={styles.text3}>You agree and acknowledge that we may keep a log of the Internet Protocol ("IP") addresses and Mac Addresses of any Devices which access the Service, the times when they have accessed the Service and the activity associated with that IP address. We treat such information with the same degree of security as the Data above.</Text>

<Text style={styles.text3}>You agree that we are entitled to co-operate with law enforcement authorities, governmental agencies, other authorities and rights-holders in the investigation of any suspected or alleged illegal activity by you which may include, but is not limited to, disclosure of such information that we have and are entitled to provide by law to such law enforcement authorities, governmental agencies, other authorities and/or rights-holders.</Text>

<Text style={styles.text3}>You agree to indemnity us from any loss or damage we may suffer or incur arising out of or in connection with any breach of these Terms of Use by you. If you supply your Results or Health Information or ask us to supply your Results or Health Information to any third parties, you agree to indemnify us from any loss or damage we may suffer or incur arising out of or in connection with the supply of such Results or Health Information to third parties.</Text>

<Text style={styles.text2}>12. Availability of The Service</Text>

<Text style={styles.text3}>The Service is provided "as is" and on an "as available" basis. The Services are based on the current state of the art of the technology in use at the time of providing the Services to you. We give no warranty that the Service will be free of defects and/or faults. To the maximum extent permitted by law, we provide no warranties (express or implied) of fitness for a particular purpose, accuracy of information, compatibility or satisfactory quality.</Text>

<Text style={styles.text3}>We do not guarantee that the Service, or any content in it, will always be available or be uninterrupted. Availability of the Service is permitted on a temporary basis. We may suspend, withdraw, discontinue or change all or any part of the Service without notice. We will not be liable to you if for any reason the Service is unavailable at any time or for any period.</Text>

<Text style={styles.text3}>We reserve the right at all times to withdraw the Service, change the specifications or manner of use of the Service, to change access codes, usernames, passwords or other security information necessary to access the Service.</Text>

<Text style={styles.text3}>We may (but are not under obligation to) update the Service from time to time and such updates may be automatically downloaded and installed by the software that you use. These updates are designed to improve, enhance and further develop the Service and may take the form of software maintenance updates, patches, and bug fixes. You agree to receive such updates and permit us to deliver them to you as part of your use of the Service. We reserve the right to charge for upgrades which are intended to have new or improved or enhanced functions, as well as new versions of the Service that we designate as an upgrade.</Text>

<Text style={styles.text3}>We accept no liability for any disruption or non-availability of the Service resulting from external causes including, but not limited to, ISP equipment failure, host equipment failure, communications network failure, power failure, natural events, acts of war or legal restrictions and censorship.</Text>

<Text style={styles.text2}>13. Limitation of Liability</Text>

<Text style={styles.text3}>In no event will we be liable for any direct, indirect, special, punitive, exemplary, or consequential losses or damages of whatsoever kind arising out of your use of or access to the Service, including but not limited to loss of profit or the like whether or not in the contemplation of the parties or whether based on breach of contract, tort (including negligence), product liability, or otherwise. </Text>

<Text style={styles.text3}>To the extent permitted by law, we exclude all conditions, warranties, representations or other terms which may apply to the Service, whether express or implied.</Text>

<Text style={styles.text3}>We are not liable to you for any damage or alteration to any Devices and other equipment, including but not limited to computer equipment, handheld devices or mobile telephones as a result of the installation or use of the Service.</Text>

<Text style={styles.text3}>We will not be liable for any loss or damage caused by a virus, distributed denial-of-service attack, or other technologically harmful material that may infect the Devices and any programs, data or proprietary material contained in such Devices due to your use of the Service.</Text>

<Text style={styles.text3}>Nothing in these Terms of Use shall exclude or limit our liability for death or personal injury caused by negligence or for fraud or fraudulent misrepresentation or any other liability which cannot be excluded or limited under the applicable law.</Text>

<Text style={styles.text2}>14. Termination</Text>

<Text style={styles.text3}>Without prior notice, we may suspend or terminate these Terms of Use or your access to all or part of the Service at any time for any reason or no reason, including, but not limited to, if we reasonably believe: (i) you have violated these Terms of Service; (ii) you create risk or possible legal exposure for us; or (iii) our provision of the Service to you is no longer commercially viable. We are not liable to you or any third party for any termination of your access to all or part of the Service.</Text>

<Text style={styles.text3}>You may terminate your use of the Service at any time for any reason or no reason by notifying us at any time via the appropriate options in the user interface in the mobile app's 'Account' screen. We will then delete your registration for the Service.</Text>

<Text style={styles.text2}>15. Events Outside Our Control</Text>

<Text style={styles.text3}>We will not be liable or responsible for any failure to perform, or delay in performance of, any of our obligations under these Terms of Use that is caused by any act or event beyond our reasonable control, including but not limited to failure of public or private telecommunications networks or broadband connections or interruptions of any third party services (<Text style={styles.bf}>"Event Outside Our Control"</Text>). If an Event Outside Our Control takes place that affects the performance of our obligations under these Terms of Use, our obligations under these Terms of Use will be suspended and the time for performance of our obligations will be extended for the duration of the Event Outside Our Control and we will use our reasonable endeavours to find a solution by which our obligations under these Terms of Use may be performed despite the Event Outside Our Control.</Text>

<Text style={styles.text2}>16. Other Important Terms</Text>

<Text style={styles.text3}>We may transfer our rights and obligations under these Terms of Use to another organisation, but this will not affect your rights under these Terms of Use. You may only transfer your rights or obligations under these Terms of Use to another person if we agree in writing. If we fail to insist that you perform any of your obligations under these Terms of Use, or if we do not enforce our rights against you, or if we delay in doing so, that will not mean that we have waived our rights against you and will not mean that you do not have to comply with those obligations. If we do waive a default by you, we will only do so in writing, and that will not mean that we will automatically waive any later default by you. Each of the conditions of these Terms of Use operates separately. If any court or competent authority decides that any of them are unlawful or unenforceable, the remaining conditions will remain in full force and effect.</Text>

<Text style={styles.text3}>The following clauses of these Terms of Use shall survive termination of these Terms of Use, howsoever arising: clauses 2, 6, 10, 11, 13, 15, 16 and 17.</Text>

<Text style={styles.text2}>17. Governing Law and Jurisdiction</Text>

<Text style={styles.text3}>These Terms of Use shall be governed by the laws of the Hong Kong. You agree to submit to the exclusive jurisdiction of the Hong Kong courts.</Text>

<Text style={styles.text3}>For any queries, please contact support@blockdoc.com.</Text>

</ScrollView>

<Header 
  title={'Terms'}
  navigation={this.props}
  back={true}
/>

</View>);}}

// Line height settings make google pixel3 to correctly render Chinese
const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
  },
  text2: {
    fontSize: 18,
    lineHeight: 18 * 1.3,
    marginTop: 6,
    marginBottom: 6,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: colors.darkGray
  },
  text3: {
    fontSize: 14,
    lineHeight: 14 * 1.3,
    marginTop: 3,
    marginBottom: 3,
    color: colors.darkGray
  },
  bf: {
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(TermsAndConditionsScreen_en);