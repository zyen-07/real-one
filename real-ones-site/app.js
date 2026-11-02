(function(){
const root=document.getElementById('app');
let db=null,user=null,myId=null,myName='',subs=[],curRender=null;
const MIN_Q=10,MAX_Q=15;

/* ---------- languages (UI text only; quiz questions stay as the creator wrote them) ---------- */
const LANGS=[['en','English'],['ta','தமிழ்'],['hi','हिन्दी']];
const T={
en:{
 bubble:"let’s find my *real* ~friends~",
 titleFriend:"do you *really know* ~{who}~?",
 subFriend:"let’s see how well you know *{who}*",
 titleOwner:"how well do your friends *really know* ~you~?",
 subOwner:"make your quiz in 2 minutes",
 subPreview:"this is the page your friends will see",
 start:"start quiz", myLink:"get my link",
 scoreboard:"Scoreboard", played1:"{n} friend played", playedN:"{n} friends played",
 noScores:"No scores yet. Be the first to play.", loadMore:"Load more",
 loadingScores:"Loading scores…", scoresFail:"Scores could not load. Reload to try again.",
 makeQuiz:"Make your quiz", editQuiz:"Edit your quiz",
 builderLead:"10 questions are ready. Edit them and tick the answer that is true for you. Pictures are added automatically.",
 yourName:"Your name (friends see this)", questionN:"Question {n}", remove:"Remove",
 addPic:"Add picture", changePic:"Change", removePic:"Remove", picture:"Picture",
 answerN:"Answer {n}", tickHint:"Tick the answer that is true for you.", addQ:"Add a question ({n} of {max})",
 saveBtn:"Save and get my link", cancel:"Cancel", back:"Back",
 errName:"Type your name so friends see who the quiz is about.",
 errQEmpty:"Question {n} is empty.", errAns:"Question {n} needs both answers.",
 errTick:"Question {n}: tick the answer that is true for you.",
 errSave:"Could not save. You may have view-only access to this page.",
 uploading:"Uploading…", errUpload:"Could not upload that picture. Try another image.",
 noUpload:"Only the page owner can add pictures.",
 ready:"Your quiz is ready", shareHint:"Send this link in your group chat. Friends need access to this page to answer.",
 copy:"Copy", copied:"Copied", pressCopy:"Press copy", copyLink:"copy my link",
 editQuestions:"Edit questions", viewBoard:"View my scoreboard",
 nameEyebrow:"{n} questions about {who}", callYou:"What should we call you?", yourNameLbl:"Your name", namePh:"Your name",
 letsGo:"Let’s go", errNick:"Type a name so {who} knows it was you.",
 qOf:"Question {i} of {n}", next:"Next", seeScore:"See my score",
 yourScore:"Your score", saving:"Saving your score…", saved:"Score saved to the scoreboard.",
 saveFail:"Your score could not be saved. You may have view-only access to this page.",
 yourAnswers:"Your answers", right:"Right", missed:"Missed", youSaid:"You said: ", correctAns:"Correct answer: ",
 stump:"Think you can stump your friends?", makeOwn:"Make my own quiz",
 notFound:"Quiz not found", notFoundLead:"The link may be mistyped, or you may not have access to this page yet.",
 ownQuiz:"This is your own quiz", ownQuizLead:"You already know the answers. Open your scoreboard to see who played.",
 goBoard:"Go to my scoreboard", signInMake:"Sign in to make a quiz", signInMakeLead:"Open this page while signed in to claude.ai.",
 signInPlay:"Sign in to play", signInPlayLead:"Open this link while signed in to claude.ai.",
 loading:"Loading…", lang:"Language",
 winMsg:"Yay! You really know {who}!", loseMsg:"Oh no… you barely know {who}."
},
ta:{
 bubble:"என் *உண்மையான* ~நண்பர்களை~ கண்டுபிடிப்போம்",
 titleFriend:"உங்களுக்கு ~{who}~-ஐ *உண்மையில்* தெரியுமா?",
 subFriend:"*{who}*-ஐ நீங்கள் எவ்வளவு நன்றாக அறிவீர்கள் என்று பார்ப்போம்",
 titleOwner:"உங்கள் நண்பர்களுக்கு உங்களைப் பற்றி *உண்மையில்* ~எவ்வளவு~ தெரியும்?",
 subOwner:"2 நிமிடத்தில் உங்கள் வினாடி வினாவை உருவாக்குங்கள்",
 subPreview:"உங்கள் நண்பர்கள் பார்க்கும் பக்கம் இதுதான்",
 start:"வினாடி வினா தொடங்கு", myLink:"என் இணைப்பைப் பெறு",
 scoreboard:"மதிப்பெண் பலகை", played1:"{n} நண்பர் விளையாடினார்", playedN:"{n} நண்பர்கள் விளையாடினர்",
 noScores:"இன்னும் மதிப்பெண்கள் இல்லை. முதலில் விளையாடுங்கள்.", loadMore:"மேலும் காட்டு",
 loadingScores:"மதிப்பெண்கள் ஏற்றப்படுகின்றன…", scoresFail:"மதிப்பெண்களை ஏற்ற முடியவில்லை. மீண்டும் ஏற்றிப் பாருங்கள்.",
 makeQuiz:"உங்கள் வினாடி வினாவை உருவாக்குங்கள்", editQuiz:"உங்கள் வினாடி வினாவைத் திருத்துங்கள்",
 builderLead:"10 கேள்விகள் தயாராக உள்ளன. அவற்றைத் திருத்தி, உங்களுக்குச் சரியான பதிலைத் தேர்ந்தெடுங்கள். படங்கள் தானாகச் சேர்க்கப்படும்.",
 yourName:"உங்கள் பெயர் (நண்பர்களுக்குத் தெரியும்)", questionN:"கேள்வி {n}", remove:"நீக்கு",
 addPic:"படம் சேர்", changePic:"மாற்று", removePic:"நீக்கு", picture:"படம்",
 answerN:"பதில் {n}", tickHint:"உங்களுக்குச் சரியான பதிலைத் தேர்ந்தெடுங்கள்.", addQ:"கேள்வி சேர் ({n} / {max})",
 saveBtn:"சேமித்து என் இணைப்பைப் பெறு", cancel:"ரத்து செய்", back:"பின்",
 errName:"நண்பர்களுக்குத் தெரிய உங்கள் பெயரை உள்ளிடுங்கள்.",
 errQEmpty:"கேள்வி {n} காலியாக உள்ளது.", errAns:"கேள்வி {n}-க்கு இரண்டு பதில்களும் வேண்டும்.",
 errTick:"கேள்வி {n}: உங்களுக்குச் சரியான பதிலைத் தேர்ந்தெடுங்கள்.",
 errSave:"சேமிக்க முடியவில்லை. இந்தப் பக்கத்தை நீங்கள் பார்க்க மட்டுமே முடியலாம்.",
 uploading:"பதிவேற்றுகிறது…", errUpload:"அந்தப் படத்தைப் பதிவேற்ற முடியவில்லை. வேறு படத்தை முயலுங்கள்.",
 noUpload:"பக்க உரிமையாளர் மட்டுமே படங்களைச் சேர்க்க முடியும்.",
 ready:"உங்கள் வினாடி வினா தயார்", shareHint:"இந்த இணைப்பை உங்கள் குழு அரட்டையில் அனுப்புங்கள். பதிலளிக்க நண்பர்களுக்கு இந்தப் பக்கத்திற்கான அணுகல் வேண்டும்.",
 copy:"நகலெடு", copied:"நகலெடுத்தது", pressCopy:"நகலெடு என்பதை அழுத்தவும்", copyLink:"என் இணைப்பை நகலெடு",
 editQuestions:"கேள்விகளைத் திருத்து", viewBoard:"என் மதிப்பெண் பலகையைப் பார்",
 nameEyebrow:"{who} பற்றிய {n} கேள்விகள்", callYou:"உங்களை என்ன பெயரில் அழைப்பது?", yourNameLbl:"உங்கள் பெயர்", namePh:"உங்கள் பெயர்",
 letsGo:"தொடங்கலாம்", errNick:"{who}-க்குத் தெரிய ஒரு பெயரை உள்ளிடுங்கள்.",
 qOf:"கேள்வி {i} / {n}", next:"அடுத்து", seeScore:"என் மதிப்பெண்ணைப் பார்",
 yourScore:"உங்கள் மதிப்பெண்", saving:"மதிப்பெண்ணைச் சேமிக்கிறது…", saved:"மதிப்பெண் பலகையில் சேமிக்கப்பட்டது.",
 saveFail:"உங்கள் மதிப்பெண்ணைச் சேமிக்க முடியவில்லை.",
 yourAnswers:"உங்கள் பதில்கள்", right:"சரி", missed:"தவறு", youSaid:"நீங்கள் சொன்னது: ", correctAns:"சரியான பதில்: ",
 stump:"உங்கள் நண்பர்களைத் திணறடிக்க முடியுமா?", makeOwn:"என் சொந்த வினாடி வினாவை உருவாக்கு",
 notFound:"வினாடி வினா கிடைக்கவில்லை", notFoundLead:"இணைப்பு தவறாக இருக்கலாம், அல்லது இந்தப் பக்கத்திற்கான அணுகல் உங்களுக்கு இன்னும் இல்லை.",
 ownQuiz:"இது உங்கள் சொந்த வினாடி வினா", ownQuizLead:"பதில்கள் உங்களுக்கே தெரியும். யார் விளையாடினார்கள் என்று பார்க்க உங்கள் மதிப்பெண் பலகையைத் திறவுங்கள்.",
 goBoard:"என் மதிப்பெண் பலகைக்குச் செல்", signInMake:"வினாடி வினா உருவாக்க உள்நுழையுங்கள்", signInMakeLead:"claude.ai-இல் உள்நுழைந்த நிலையில் இந்தப் பக்கத்தைத் திறவுங்கள்.",
 signInPlay:"விளையாட உள்நுழையுங்கள்", signInPlayLead:"claude.ai-இல் உள்நுழைந்த நிலையில் இந்த இணைப்பைத் திறவுங்கள்.",
 loading:"ஏற்றுகிறது…", lang:"மொழி",
 winMsg:"அருமை! நீங்கள் {who}-ஐ உண்மையில் அறிவீர்கள்!", loseMsg:"அச்சச்சோ… உங்களுக்கு {who}-ஐ அவ்வளவாகத் தெரியவில்லை."
},
hi:{
 bubble:"चलो अपने *सच्चे* ~दोस्त~ ढूँढें",
 titleFriend:"क्या तुम *सच में* ~{who}~ को जानते हो?",
 subFriend:"देखते हैं तुम *{who}* को कितना जानते हो",
 titleOwner:"तुम्हारे दोस्त तुम्हें *सच में* ~कितना~ जानते हैं?",
 subOwner:"2 मिनट में अपना क्विज़ बनाओ",
 subPreview:"तुम्हारे दोस्तों को यही पेज दिखेगा",
 start:"क्विज़ शुरू करें", myLink:"मेरा लिंक पाएँ",
 scoreboard:"स्कोरबोर्ड", played1:"{n} दोस्त ने खेला", playedN:"{n} दोस्तों ने खेला",
 noScores:"अभी कोई स्कोर नहीं। सबसे पहले खेलो।", loadMore:"और दिखाएँ",
 loadingScores:"स्कोर लोड हो रहे हैं…", scoresFail:"स्कोर लोड नहीं हो सके। दोबारा लोड करके देखें।",
 makeQuiz:"अपना क्विज़ बनाओ", editQuiz:"अपना क्विज़ बदलो",
 builderLead:"10 सवाल तैयार हैं। उन्हें बदलो और अपना सही जवाब चुनो। तस्वीरें अपने आप जुड़ जाएँगी।",
 yourName:"तुम्हारा नाम (दोस्तों को दिखेगा)", questionN:"सवाल {n}", remove:"हटाएँ",
 addPic:"फ़ोटो जोड़ें", changePic:"बदलें", removePic:"हटाएँ", picture:"फ़ोटो",
 answerN:"जवाब {n}", tickHint:"वह जवाब चुनो जो तुम्हारे लिए सही है।", addQ:"सवाल जोड़ें ({n} / {max})",
 saveBtn:"सेव करके मेरा लिंक पाएँ", cancel:"रद्द करें", back:"वापस",
 errName:"अपना नाम लिखो ताकि दोस्त देख सकें क्विज़ किसका है।",
 errQEmpty:"सवाल {n} खाली है।", errAns:"सवाल {n} के दोनों जवाब चाहिए।",
 errTick:"सवाल {n}: वह जवाब चुनो जो तुम्हारे लिए सही है।",
 errSave:"सेव नहीं हो सका। हो सकता है तुम्हारे पास इस पेज को सिर्फ़ देखने की अनुमति हो।",
 uploading:"अपलोड हो रहा है…", errUpload:"वह फ़ोटो अपलोड नहीं हो सकी। कोई दूसरी फ़ोटो आज़माओ।",
 noUpload:"सिर्फ़ पेज का मालिक फ़ोटो जोड़ सकता है।",
 ready:"तुम्हारा क्विज़ तैयार है", shareHint:"यह लिंक अपने ग्रुप चैट में भेजो। जवाब देने के लिए दोस्तों को इस पेज की पहुँच चाहिए।",
 copy:"कॉपी", copied:"कॉपी हो गया", pressCopy:"कॉपी दबाओ", copyLink:"मेरा लिंक कॉपी करें",
 editQuestions:"सवाल बदलें", viewBoard:"मेरा स्कोरबोर्ड देखें",
 nameEyebrow:"{who} के बारे में {n} सवाल", callYou:"तुम्हें क्या कहकर बुलाएँ?", yourNameLbl:"तुम्हारा नाम", namePh:"तुम्हारा नाम",
 letsGo:"चलो शुरू करें", errNick:"नाम लिखो ताकि {who} को पता चले कि यह तुम हो।",
 qOf:"सवाल {i} / {n}", next:"आगे", seeScore:"मेरा स्कोर देखें",
 yourScore:"तुम्हारा स्कोर", saving:"स्कोर सेव हो रहा है…", saved:"स्कोर स्कोरबोर्ड में सेव हो गया।",
 saveFail:"तुम्हारा स्कोर सेव नहीं हो सका।",
 yourAnswers:"तुम्हारे जवाब", right:"सही", missed:"गलत", youSaid:"तुमने कहा: ", correctAns:"सही जवाब: ",
 stump:"क्या तुम अपने दोस्तों को उलझा सकते हो?", makeOwn:"अपना क्विज़ बनाओ",
 notFound:"क्विज़ नहीं मिला", notFoundLead:"लिंक गलत हो सकता है, या अभी तुम्हारे पास इस पेज की पहुँच नहीं है।",
 ownQuiz:"यह तुम्हारा अपना क्विज़ है", ownQuizLead:"जवाब तो तुम्हें पता ही हैं। कौन खेला यह देखने के लिए अपना स्कोरबोर्ड खोलो।",
 goBoard:"मेरे स्कोरबोर्ड पर जाएँ", signInMake:"क्विज़ बनाने के लिए साइन इन करें", signInMakeLead:"claude.ai में साइन इन करके यह पेज खोलो।",
 signInPlay:"खेलने के लिए साइन इन करें", signInPlayLead:"claude.ai में साइन इन करके यह लिंक खोलो।",
 loading:"लोड हो रहा है…", lang:"भाषा",
 winMsg:"वाह! तुम {who} को सच में जानते हो!", loseMsg:"अरे नहीं… तुम {who} को ज़्यादा नहीं जानते।"
}};
let lang='en';
try{const s=localStorage.getItem('ro-lang');if(s&&T[s])lang=s}catch(e){}
function setLang(c){lang=c;try{localStorage.setItem('ro-lang',c)}catch(e){}}
function raw(k){return (T[lang]&&T[lang][k])||T.en[k]||k}
function fill(s,v){return s.replace(/\{(\w+)\}/g,(m,k)=>v&&v[k]!=null?v[k]:m)}
function t(k,v){return fill(raw(k),v)}
function rich(tpl,v){
  return tpl.split(/(\*[^*]+\*|~[^~]+~)/).filter(Boolean).map(p=>{
    if(p[0]==='*'&&p.length>2&&p.endsWith('*'))return h('b',null,fill(p.slice(1,-1),v));
    if(p[0]==='~'&&p.length>2&&p.endsWith('~'))return h('em',null,fill(p.slice(1,-1),v));
    return fill(p,v);
  });
}
function tr(k,v){return rich(raw(k),v)}

/* ---------- default questions: two answers each ---------- */
const DEFAULT_QS=[
  {q:'What is my favourite food?',e:'🍽️',opts:[['Biryani','🍛'],['Pizza','🍕']]},
  {q:'What would I do first if I won 1 crore rupees?',e:'💰',opts:[['Travel the world','✈️'],['Invest it','📈']]},
  {q:'What scares me the most?',e:'😱',opts:[['Heights','🏢'],['Being alone','🌙']]},
  {q:'Am I a morning person or a night owl?',e:'⏰',opts:[['Morning person','🌅'],['Night owl','🦉']]},
  {q:'How do I react when I get angry?',e:'😠',opts:[['Go silent','🤐'],['Shout it out','📢']]},
  {q:'What do I do with a free Sunday?',e:'🛋️',opts:[['Sleep all day','😴'],['Hang out with friends','👯']]},
  {q:'Which of these do I secretly love?',e:'🎧',opts:[['Old songs','📻'],['Reels and memes','📱']]},
  {q:'What is my biggest red flag?',e:'🚩',opts:[['I reply late','⏳'],['I overthink everything','🤯']]},
  {q:'Where would I go on my dream trip?',e:'🌍',opts:[['Goa','🏖️'],['Paris','🗼']]},
  {q:'What is my dream job?',e:'💼',opts:[['Government job','🏛️'],['Own business','🏪']]},
  {q:'What would I never share with anyone?',e:'🤫',opts:[['My snacks','🍫'],['My playlist','🎵']]},
  {q:'If I could have one superpower, which would it be?',e:'🦸',opts:[['Fly','🕊️'],['Read minds','🧠']]},
  {q:'Do I prefer tea or coffee?',e:'☕',opts:[['Tea','🍵'],['Coffee','☕']]},
  {q:'Beach or mountains for me?',e:'🌄',opts:[['Beach','🏝️'],['Mountains','⛰️']]},
  {q:'Which would I pick for a holiday?',e:'🧳',opts:[['Road trip','🚗'],['Staying home','🏠']]}
];
const QUIZ_TYPES=[
 {id:'future-friends',title:'Future Friends',emoji:'👯',desc:'Meet new people and see who could become your real one.',questions:[
  {q:'What quality matters most to me in a new friend?',e:'💛',opts:[['Kindness','💛'],['A great sense of humour','😄']]},{q:'What would be my ideal first hangout with a new friend?',e:'☕',opts:[['Coffee and a long chat','☕'],['A fun activity together','🎳']]},{q:'How do I usually feel in a brand-new group?',e:'👋',opts:[['I start chatting pretty quickly','🗣️'],['I warm up after a little while','🌱']]},{q:'Which plan would I be most likely to say yes to?',e:'🎟️',opts:[['A relaxed movie night','🍿'],['A spontaneous day out','🚌']]},{q:'What small thing makes me feel included?',e:'🫶',opts:[['Someone remembers to invite me','💌'],['Someone asks what I think','💬']]},{q:'What kind of humour do I enjoy most?',e:'😂',opts:[['Silly jokes and memes','🤪'],['Quick wit and wordplay','🧠']]},{q:'How do I like friends to keep in touch?',e:'📱',opts:[['Little messages often','💬'],['A proper catch-up now and then','📞']]},{q:'What would help me feel comfortable around someone new?',e:'🌼',opts:[['They ask me questions','❓'],['They share something about themselves','😊']]},{q:'What would I pick for a free afternoon with friends?',e:'🌤️',opts:[['Explore somewhere new','🗺️'],['Stay in and chat','🏠']]},{q:'What kind of friend group suits me best?',e:'✨',opts:[['A small, close-knit crew','🫂'],['A big, lively gang','🎉']]}
 ]},
 {id:'couples',title:'Couples',emoji:'💑',desc:'A sweet little challenge about the things I like in a relationship.',questions:[
  {q:'What would be my ideal date?',e:'🌹',opts:[['A cosy dinner together','🍝'],['A playful day out','🎡']]},{q:'What helps me feel appreciated?',e:'💌',opts:[['Thoughtful little gestures','🎁'],['Kind words and encouragement','💬']]},{q:'How would I want to spend a quiet evening together?',e:'🛋️',opts:[['A movie and snacks','🍿'],['Music and conversation','🎶']]},{q:'What kind of special-day plan would I prefer?',e:'🎂',opts:[['A planned surprise','🎁'],['Choosing something together','🤝']]},{q:'When I have a tough day, what would cheer me up?',e:'🌦️',opts:[['A hug and a little company','🫂'],['Space, then a check-in','🌿']]},{q:'Which weekend plan sounds more like me?',e:'🗓️',opts:[['A slow morning at home','☕'],['A mini adventure together','🚗']]},{q:'What makes time together feel special to me?',e:'✨',opts:[['Doing something new','🧭'],['Sharing an everyday routine','🍳']]},{q:'How do I like to celebrate good news?',e:'🥳',opts:[['A fun little celebration','🎉'],['A quiet moment together','💛']]},{q:'Which kind of trip would I choose as a couple?',e:'🧳',opts:[['A beach escape','🏖️'],['A city full of things to explore','🏙️']]},{q:'What is my favourite kind of couple tradition?',e:'🫶',opts:[['A regular date night','🕯️'],['A silly shared in-joke','😄']]}
 ]},
 {id:'lover',title:'Lover',emoji:'💘',desc:'Playful, low-pressure questions about my romantic side.',questions:[
  {q:'What would make me notice someone first?',e:'👀',opts:[['Their warm smile','😊'],['Their funny personality','😄']]},{q:'What kind of first date would I enjoy?',e:'💌',opts:[['A relaxed café chat','☕'],['A fun activity with no pressure','🎳']]},{q:'Which compliment would make me smile most?',e:'☺️',opts:[['You make people feel welcome','🌼'],['You always make me laugh','😂']]},{q:'What kind of romantic gesture feels sweetest to me?',e:'🌷',opts:[['A thoughtful note','📝'],['A tiny surprise they remembered','🎁']]},{q:'How would I most likely show someone I care?',e:'💞',opts:[['Make time for them','⏰'],['Do a helpful little thing','🧰']]},{q:'What would I rather do on a cute date?',e:'🌙',opts:[['Watch the sunset','🌅'],['Find a new dessert spot','🍰']]},{q:'Which quality do I find most attractive?',e:'✨',opts:[['Being thoughtful','💛'],['Being confident and kind','🌟']]},{q:'What would make me laugh on a date?',e:'🤣',opts:[['A goofy story','🤭'],['A clever little joke','😏']]},{q:'What kind of message would brighten my day?',e:'📱',opts:[['A sweet good-morning text','☀️'],['A funny meme that fits me','😂']]},{q:'What would my dream low-key evening with someone be?',e:'🕯️',opts:[['Cook something together','🍳'],['Talk for hours over snacks','🍪']]}
 ]}
];
function defQ(d){
  return normQ({q:d.q,img:d.e?'emoji:'+d.e:null,correct:-1,opts:d.opts.map(o=>({t:o[0],img:o[1]?'emoji:'+o[1]:null}))});
}
function normQ(x){
  const q=x.q||'';
  return {q,img:x.img||('emoji:'+autoPic(q,true)),correct:typeof x.correct==='number'?x.correct:-1,
    opts:(x.opts||[]).map(o=>{
      const tt=typeof o==='string'?o:((o&&o.t)||'');
      const im=(o&&typeof o==='object'&&o.img)||(tt?'emoji:'+autoPic(tt,false):null);
      return {t:tt,img:im};
    })};
}

function h(tag,props,...kids){
  const el=document.createElement(tag);
  for(const k in (props||{})){
    const v=props[k];
    if(k==='class')el.className=v;
    else if(k.slice(0,2)==='on')el.addEventListener(k.slice(2),v);
    else if(k==='value')el.value=v;
    else if(k==='checked')el.checked=!!v;
    else if(v===true)el.setAttribute(k,'');
    else if(v!==false&&v!=null)el.setAttribute(k,v);
  }
  for(const kid of kids.flat(Infinity)){
    if(kid==null||kid===false)continue;
    el.append(kid.nodeType?kid:document.createTextNode(String(kid)));
  }
  return el;
}
function svgBox(cls,html){const d=h('div',{class:cls});d.innerHTML=html;return d}
function clearSubs(){subs.forEach(u=>{try{u()}catch(e){}});subs=[]}
function notice(x){return h('div',{class:'empty'},x)}
function randSlug(){
  const c='abcdefghjkmnpqrstuvwxyz23456789';let s='';
  const a=new Uint8Array(7);crypto.getRandomValues(a);
  for(const n of a)s+=c[n%c.length];
  return s;
}
function shareUrl(slug){return location.href.split('#')[0].split('?')[0]+'#play-'+slug}
function copy(text,input,btn){
  const done=()=>{btn.textContent=t('copied');setTimeout(()=>btn.textContent=t('copy'),1400)};
  try{navigator.clipboard.writeText(text).then(done,()=>{input.select();btn.textContent=t('pressCopy')})}
  catch(e){input.select();btn.textContent=t('pressCopy')}
}
function imgSrc(id){return '/_blob/'+id}
function picNode(id,cls){
  if(String(id).startsWith('emoji:'))return h('div',{class:((cls||'')+' emo').trim(),'aria-hidden':'true'},String(id).slice(6));
  return h('img',{class:cls||null,src:imgSrc(id),alt:''});
}

/* ---------- automatic pictures: picked from the words in each question or answer ---------- */
const PICS=[
 [/\b(biryani|briyani)/,'🍛'],[/\bpizza/,'🍕'],[/\bburger/,'🍔'],[/\b(dosa|idli|uttapam)/,'🥞'],[/\b(noodle|pasta|maggi)/,'🍜'],
 [/\b(chicken|mutton|non-?veg|kebab)/,'🍗'],[/\b(rice|meals|sambar|curry)/,'🍚'],[/\b(ice ?cream|kulfi)/,'🍦'],
 [/\b(chocolate|sweets?|candy)/,'🍫'],[/\b(cake|birthday)/,'🎂'],[/\b(tea|chai)\b/,'🍵'],[/\bcoffee/,'☕'],
 [/\b(juice|milkshake|cold drink|soda)/,'🥤'],[/\b(mango|fruit|apple|banana)/,'🍎'],[/\b(snack|chips|popcorn)/,'🍿'],
 [/\b(food|eat|hungry|lunch|dinner|breakfast|meal|cook|restaurant)/,'🍽️'],
 [/\b(invest|stock|share market|crypto)/,'📈'],[/\b(crore|lakh|money|rich|rupee|cash|bank|saving|salary)/,'💰'],
 [/\b(flight|plane|airport|abroad)/,'✈️'],[/\bfly\b/,'🕊️'],[/\b(travel|world|tour)/,'🌍'],
 [/\b(beach|sea|ocean|island|goa|maldives)/,'🏖️'],[/\b(mountain|hill|himalaya|trek|ooty|kodaikanal)/,'⛰️'],
 [/\b(paris|eiffel)/,'🗼'],[/\b(road ?trip|car|drive|driving)\b/,'🚗'],[/\b(bike|motorcycle|scooter)/,'🏍️'],
 [/\b(train|railway|bus)\b/,'🚆'],[/\b(sunday|weekend|free day)/,'🛋️'],[/\b(trip|holiday|vacation|luggage)/,'🧳'],
 [/\b(stay(ing)? home|home|house|indoors)/,'🏠'],
 [/\b(sleep|nap|bed|lazy)/,'😴'],[/\b(owl)/,'🦉'],[/\b(morning|sunrise|early)/,'🌅'],[/\b(night|midnight)/,'🌙'],
 [/\b(invisible)/,'👻'],[/\b(mind|overthink|think)/,'🧠'],[/\b(superpower|power|magic)/,'🦸'],
 [/\b(old songs|radio)/,'📻'],[/\b(reel|insta|whatsapp|phone|mobile|social|scroll|youtube)/,'📱'],
 [/\b(meme|joke|laugh|funny)/,'😂'],[/\b(song|music|playlist|singer)/,'🎵'],
 [/\b(movie|film|cinema|series|netflix|ott)/,'🎬'],[/\b(game|gaming|pubg|free fire)/,'🎮'],
 [/\b(book|read|novel)/,'📚'],[/\b(exam|test|study|marks|college|school)/,'📝'],
 [/\b(government|govt)/,'🏛️'],[/\b(business|shop|startup)/,'🏪'],[/\b(engineer|software|coder|coding|programmer|developer)/,'💻'],
 [/\b(content creator|youtuber|influencer)/,'🎥'],[/\bdoctor/,'🩺'],[/\bteacher/,'👩‍🏫'],[/\b(job|career|office|work)/,'💼'],
 [/\b(dance|dancing)/,'💃'],[/\b(sing|singing|karaoke)/,'🎤'],[/\b(cricket|ipl)/,'🏏'],[/\b(football|soccer)/,'⚽'],
 [/\b(gym|workout|fitness|exercise)/,'🏋️'],[/\b(run|running|jog)/,'🏃'],
 [/\b(friend|bestie|bff|gang)/,'👯'],[/\b(family|mom|mother|dad|father|parents|brother|sister)/,'👨‍👩‍👧'],
 [/\b(secret|never share|hide|hidden)/,'🤫'],[/\b(love|crush|girlfriend|boyfriend|relationship|marriage|wedding)/,'❤️'],
 [/\b(angry|anger|furious|mad)\b/,'😠'],[/\b(sad|cry|crying)/,'😢'],[/\b(scare|scared|afraid|fear|phobia)/,'😱'],
 [/\b(height|tall)/,'🏢'],[/\b(dark|darkness)/,'🌑'],[/\b(alone|lonely)/,'🌙'],[/\b(insect|cockroach|lizard|spider|bug)/,'🐛'],
 [/\bsnake/,'🐍'],[/\b(dog|puppy)/,'🐶'],[/\b(cat|kitten)/,'🐱'],
 [/\b(red flag|flag)/,'🚩'],[/\b(shout|scream|yell)/,'📢'],[/\b(silent|silence|quiet)/,'🤐'],
 [/\b(late|wait|delay|time)\b/,'⏳'],[/\b(password|lock|private)/,'🔑'],[/\b(gift|surprise|present)/,'🎁'],
 [/\b(party|celebrat|festival|diwali|pongal)/,'🎉'],[/\b(rain|monsoon)/,'🌧️'],[/\b(summer|sun)\b/,'☀️'],[/\b(winter|snow)/,'❄️'],
 [/\b(photo|selfie|camera)/,'📸'],[/\b(dream|future|wish|goal|ambition)/,'✨'],[/\b(favourite|favorite|best)/,'⭐'],
 [/(பிரியாணி)/,'🍛'],[/(சாப்பாடு|உணவு)/,'🍽️'],[/(தூக்கம்)/,'😴'],[/(டீ|தேநீர்)/,'🍵'],[/(காபி)/,'☕'],[/(பணம்)/,'💰'],[/(நண்பர்)/,'👯'],[/(பயம்)/,'😱'],
 [/(खाना|भोजन)/,'🍽️'],[/(चाय)/,'🍵'],[/(कॉफ़ी|कॉफी)/,'☕'],[/(नींद|सोना)/,'😴'],[/(पैसा|पैसे)/,'💰'],[/(दोस्त)/,'👯'],[/(डर)/,'😱']
];
function autoPic(text,isQ){
  const x=String(text||'').toLowerCase();
  for(const r of PICS)if(r[0].test(x))return r[1];
  return isQ?'🤔':'⭐';
}

/* ---------- art (all drawn for this page) ---------- */
const NAVY='#1d2a5b';
const STRIPES='<path d="M70 24v12M57 27l4 11M83 27l-4 11" stroke="'+NAVY+'" stroke-width="4" stroke-linecap="round" fill="none"/>';
const HEART='<path d="M70 48c-10-7-11-16-4-16 3 0 4 2 4 4 0-2 1-4 4-4 7 0 6 9-4 16z" fill="#e57634"/>';
function kitten(o,head,mood,attrs){
  const s=NAVY,sad=mood==='sad';
  const earL='<path d="M26 44L20 8l40 22z" fill="'+o.fur+'" stroke="'+s+'" stroke-width="4" stroke-linejoin="round"/><path d="M31 36L28 18l18 10z" fill="'+o.ear+'"/>';
  const earR='<path d="M114 44l6-36-40 22z" fill="'+o.fur+'" stroke="'+s+'" stroke-width="4" stroke-linejoin="round"/><path d="M109 36l3-18-18 10z" fill="'+o.ear+'"/>';
  const mouth=sad
    ?'<path d="M70 82v2M58 95q12-10 24 0" fill="none" stroke="'+s+'" stroke-width="2.5" stroke-linecap="round"/>'
    :'<path d="M70 82v3M70 85q-3 5-8 2M70 85q3 5 8 2" fill="none" stroke="'+s+'" stroke-width="2.5" stroke-linecap="round"/>';
  const brows=sad?'<path d="M32 52l22-8M108 52l-22-8" fill="none" stroke="'+s+'" stroke-width="3.5" stroke-linecap="round"/>':'';
  const tears=sad?'<g class="tearA"><path d="M40 76q-6 9 0 13 6-4 0-13z" fill="#6ec3ff" stroke="#2f8fd6" stroke-width="1.5"/></g><g class="tearB"><path d="M100 76q-6 9 0 13 6-4 0-13z" fill="#6ec3ff" stroke="#2f8fd6" stroke-width="1.5"/></g>':'';
  return '<svg '+(attrs||'')+' viewBox="'+(head?'6 4 128 104':'0 0 140 124')+'" aria-hidden="true">'
  +(sad?'<g transform="rotate(-24 40 40)">'+earL+'</g><g transform="rotate(24 100 40)">'+earR+'</g>':earL+earR)
  +'<ellipse cx="70" cy="64" rx="52" ry="42" fill="'+o.fur+'" stroke="'+s+'" stroke-width="4"/>'
  +'<ellipse cx="70" cy="82" rx="26" ry="18" fill="'+o.muzzle+'"/>'
  +(o.mark||'')
  +'<ellipse cx="46" cy="64" rx="9" ry="11" fill="'+s+'"/><ellipse cx="94" cy="64" rx="9" ry="11" fill="'+s+'"/>'
  +'<circle cx="43" cy="60" r="'+(sad?4.2:3.2)+'" fill="#fff"/><circle cx="50" cy="68" r="1.6" fill="#fff"/>'
  +'<circle cx="91" cy="60" r="'+(sad?4.2:3.2)+'" fill="#fff"/><circle cx="98" cy="68" r="1.6" fill="#fff"/>'
  +brows
  +'<circle cx="30" cy="80" r="6" fill="#ff9ab8" opacity=".8"/><circle cx="110" cy="80" r="6" fill="#ff9ab8" opacity=".8"/>'
  +'<path d="M65 76h10l-5 6z" fill="#ff9ab8" stroke="'+s+'" stroke-width="2" stroke-linejoin="round"/>'
  +mouth
  +'<path d="M12 72l18 3M12 82l18-3M128 72l-18 3M128 82l-18-3" stroke="'+s+'" stroke-width="2" stroke-linecap="round" opacity=".7"/>'
  +tears
  +(head?'':
    '<ellipse cx="46" cy="112" rx="15" ry="10" fill="'+o.muzzle+'" stroke="'+s+'" stroke-width="4"/>'
   +'<ellipse cx="94" cy="112" rx="15" ry="10" fill="'+o.muzzle+'" stroke="'+s+'" stroke-width="4"/>'
   +'<path d="M42 108v6M50 108v6M90 108v6M98 108v6" stroke="'+s+'" stroke-width="2" stroke-linecap="round"/>')
  +'</svg>';
}
const KIT_A={fur:'#e57634',muzzle:'#feb16b',ear:'#fba7a7',mark:STRIPES};
const KIT_B={fur:'#fba7a7',muzzle:'#fff1e6',ear:'#feb16b',mark:HEART};
const AV=[KIT_A,KIT_B,
  {fur:'#b8c4d9',muzzle:'#eef2f8',ear:'#fba7a7',mark:STRIPES},
  {fur:'#cdb8f0',muzzle:'#f4eeff',ear:'#fba7a7',mark:''},
  {fur:'#f6d27a',muzzle:'#fff6d9',ear:'#fba7a7',mark:STRIPES},
  {fur:'#9fd8c0',muzzle:'#effaf4',ear:'#fba7a7',mark:HEART}];
function heartAt(cx,cy,cls){return '<path class="heart '+cls+'" d="M'+cx+' '+(cy+9)+'c-9-7-10-15-4-15 3 0 4 2 4 4 0-2 1-4 4-4 6 0 5 8-4 15z"/>'}
function hugScene(){
  const N=NAVY;
  return '<svg viewBox="0 0 260 170" aria-hidden="true" class="hug">'
  +'<ellipse cx="85" cy="142" rx="44" ry="28" fill="#e57634" stroke="'+N+'" stroke-width="4"/>'
  +'<ellipse cx="175" cy="142" rx="44" ry="28" fill="#fba7a7" stroke="'+N+'" stroke-width="4"/>'
  +'<g class="ka"><g transform="rotate(-8 85 70)">'+kitten(KIT_A,true,null,'x="25" y="22" width="120" height="98"')+'</g></g>'
  +'<g class="kb"><g transform="rotate(8 175 70)">'+kitten(KIT_B,true,null,'x="115" y="22" width="120" height="98"')+'</g></g>'
  +'<path d="M100 138Q140 116 182 124" fill="none" stroke="'+N+'" stroke-width="20" stroke-linecap="round"/>'
  +'<path d="M100 138Q140 116 182 124" fill="none" stroke="#e57634" stroke-width="12" stroke-linecap="round"/>'
  +'<path d="M160 138Q120 116 78 124" fill="none" stroke="'+N+'" stroke-width="20" stroke-linecap="round"/>'
  +'<path d="M160 138Q120 116 78 124" fill="none" stroke="#fba7a7" stroke-width="12" stroke-linecap="round"/>'
  +'<circle cx="182" cy="124" r="8" fill="#feb16b" stroke="'+N+'" stroke-width="3"/>'
  +'<circle cx="78" cy="124" r="8" fill="#fff1e6" stroke="'+N+'" stroke-width="3"/>'
  +heartAt(130,30,'h1')+heartAt(104,42,'h2')+heartAt(156,42,'h3')
  +'</svg>';
}
function sadScene(){
  const N=NAVY,C='#c9d3e6';
  return '<svg viewBox="0 0 220 180" aria-hidden="true" class="sad">'
  +'<g fill="'+N+'"><circle cx="80" cy="36" r="21"/><circle cx="110" cy="27" r="25"/><circle cx="140" cy="37" r="20"/><rect x="62" y="34" width="96" height="26" rx="13"/></g>'
  +'<g fill="'+C+'"><circle cx="80" cy="36" r="17"/><circle cx="110" cy="27" r="21"/><circle cx="140" cy="37" r="16"/><rect x="66" y="38" width="88" height="18" rx="9"/></g>'
  +'<g stroke="#4aa9ff" stroke-width="3.5" stroke-linecap="round"><path class="drop" d="M88 66v9"/><path class="drop" style="animation-delay:.35s" d="M110 66v9"/><path class="drop" style="animation-delay:.7s" d="M132 66v9"/></g>'
  +'<g class="kh">'+kitten(KIT_A,true,'sad','x="46" y="58" width="128" height="104"')+'</g>'
  +'</svg>';
}
function avatar(name){
  let n=0;for(const c of String(name))n+=c.charCodeAt(0);
  return svgBox('av',kitten(AV[n%AV.length],true));
}
const ARROW='<svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="17" fill="#fff"/><path d="M10 18h15M19 11l7 7-7 7" fill="none" stroke="#1b8bff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const TROPHY='<svg viewBox="0 0 40 44" aria-hidden="true"><path d="M10 4h20v12a10 10 0 0 1-20 0z" fill="#ffc83d" stroke="#d98a00" stroke-width="2.5" stroke-linejoin="round"/><path d="M10 8H4c0 8 3 12 8 13M30 8h6c0 8-3 12-8 13" fill="none" stroke="#d98a00" stroke-width="2.5" stroke-linecap="round"/><path d="M20 26v8M13 40h14l-2-6H15z" fill="#ffc83d" stroke="#d98a00" stroke-width="2.5" stroke-linejoin="round"/></svg>';
const STAR='<svg class="star" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3l4.6 10.6 11.4 1-8.7 7.6 2.7 11.2L20 27.4 10 33.4l2.7-11.2L4 14.6l11.4-1z" fill="#ffd54a" stroke="#1b8bff" stroke-width="2.5" stroke-linejoin="round"/></svg>';
const DOODLES='<svg class="doodles" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M40 190l8 18 20 2-15 13 5 19-18-10-18 10 5-19-15-13 20-2z"/><path d="M320 120c10-14 22 14 32 0s22 14 32 0" class="b"/><path d="M350 330c-14-14-34 4-18 22l18 18 18-18c16-18-4-36-18-22z"/><circle cx="46" cy="470" r="14" class="b"/><path d="M340 520v28M326 534h28" class="b"/><path d="M30 640c10-14 22 14 32 0s22 14 32 0"/><path d="M340 700l8 18 20 2-15 13 5 19-18-10-18 10 5-19-15-13 20-2z" class="b"/><path d="M60 760v28M46 774h28"/></svg>';

/* ---------- shared pieces ---------- */
function header(withLang){
  const kids=[
    h('div',{class:'logo'},h('span',{class:'l1'},'Real'),h('span',{class:'l2'},'Ones')),
    svgBox('minicat',kitten(KIT_B,true))];
  if(withLang){
    kids.push(h('select',{id:'lang',class:'lang','aria-label':t('lang'),onchange:e=>{setLang(e.target.value);if(curRender)curRender()}},
      LANGS.map(l=>h('option',{value:l[0],selected:l[0]===lang},l[1]))));
  }
  return h('header',{class:'top'},kids);
}
function mount(withLang,...nodes){root.replaceChildren(header(withLang),...nodes)}
function hero(o){
  return h('section',{class:'hero'},
    h('div',{class:'hero-top'},h('div',{class:'bubble'},tr('bubble')),svgBox('bigcat',kitten(KIT_A))),
    h('div',{class:'note'},h('i',{class:'tape'}),h('h1',null,o.title),h('p',{class:'sub'},o.sub),svgBox('',STAR).firstChild),
    h('button',{class:'btn start',onclick:o.onCta},t('start'),svgBox('',ARROW).firstChild),
    o.extra||null);
}
function typePicker(){
 const cats=[KIT_A,KIT_B,{fur:'#b8c4d9',muzzle:'#eef2f8',ear:'#fba7a7',mark:STRIPES}];
 const cards=QUIZ_TYPES.map((type,i)=>h('button',
   {class:'type-card type-'+type.id,onclick:()=>builder(null,type.id)},
   svgBox('type-kitty',kitten(cats[i],true)),
   h('span',{class:'type-emoji'},type.emoji),
   h('strong',null,type.title),
   h('span',{class:'type-desc'},type.desc),
   h('span',{class:'type-cta'},'Pick this quiz →')));
 return h('section',{class:'type-picker'},
   h('h2',null,'Pick your kind of quiz'),
   h('p',{class:'lead'},'Choose a vibe. Your questions are ready to personalise.'),
   h('div',{class:'type-grid'},cards));
}
function scoreboard(board){
  return h('section',{class:'sb'},
    h('div',{class:'ribbon'},h('i',{class:'tape'}),svgBox('',TROPHY).firstChild,h('h2',null,t('scoreboard')),svgBox('',TROPHY).firstChild),
    board);
}
function row(a,i,total){
  const tot=a.total||total;
  const pct=tot?Math.round((a.score/tot)*100):0;
  return h('li',{class:'prow'},
    h('span',{class:'rk'+(i<3?' r'+(i+1):'')},i+1),
    avatar(a.name||'?'),
    h('div',null,
      h('div',{class:'pline'},h('span',{class:'nm'},a.name||'?'),h('span',{class:'sc'},h('b',null,a.score),'/'+tot)),
      h('div',{class:'bar'},h('i',{style:'width:'+pct+'%'}))));
}
function leaderboard(attempts,total,state){
  const rows=attempts.slice().sort((a,b)=>b.score-a.score||a.createdAt-b.createdAt);
  const box=h('div',{class:'lb'});
  box.append(h('div',{class:'pill-wrap'},h('span',{class:'pill'},t(rows.length===1?'played1':'playedN',{n:rows.length}))));
  if(!rows.length){box.append(notice(t('noScores')));return box}
  box.append(h('ol',{class:'plist'},rows.slice(0,state.n).map((a,i)=>row(a,i,total))));
  if(rows.length>state.n)box.append(h('button',{class:'btn more',onclick:()=>{state.n+=10;state.redraw()}},t('loadMore')));
  return box;
}
function watchAttempts(slug,total,box){
  const state={n:10};let last=[];
  const draw=()=>box.replaceChildren(leaderboard(last,total,state));
  state.redraw=draw;
  box.replaceChildren(h('div',{class:'hint'},t('loadingScores')));
  const u=db.collection('attempts').where('slug','==',slug).onSnapshot(s=>{last=s.docs.map(d=>d.data());draw()},
    ()=>box.replaceChildren(notice(t('scoresFail'))));
  subs.push(u);
}

/* ---------- Page 1 (owner): welcome, start, scoreboard, language ---------- */
async function home(){
  clearSubs();curRender=home;
  if(!db||!myId){
    mount(true,h('div',{class:'card'},h('h2',null,t('signInMake')),h('p',{class:'lead'},t('signInMakeLead'))));
    return;
  }
  mount(true,h('div',{class:'hint'},t('loading')));
  let snap;
  try{snap=await db.doc('quizzes/'+myId).get()}catch(e){snap=null}
  const q=snap&&snap.exists?snap.data():null;
  const board=h('div');
  const who=q?(q.ownerName||'me'):'';
  mount(true,
    hero({
      title:q?tr('titleFriend',{who}):tr('titleOwner'),
      sub:q?tr('subPreview'):tr('subOwner'),
      onCta:()=>q?builder(q):document.querySelector('.type-picker')?.scrollIntoView({behavior:'smooth',block:'center'}),
      extra:q?h('div',{class:'row',style:'justify-content:center'},h('button',{class:'btn ghost small',onclick:()=>done(q)},t('myLink'))):null}),
    q?null:typePicker(),
    scoreboard(board));
  if(q)watchAttempts(q.slug,q.questions.length,board);
  else board.replaceChildren(leaderboard([],10,{n:10}));
}

/* ---------- Page 2: edit quiz ---------- */
function builder(existing,presetId){
  clearSubs();curRender=null;
  const preset=QUIZ_TYPES.find(x=>x.id===presetId);
  const base=existing?existing.questions.map(normQ):preset?preset.questions.map(defQ):DEFAULT_QS.slice(0,MIN_Q).map(defQ);
  const draft={
    ownerName:(existing&&existing.ownerName)||myName||'',
    questions:base.map(x=>{
      const o=x.opts.slice(0,2);while(o.length<2)o.push({t:'',img:null});
      return {q:x.q,img:x.img,opts:o,correct:(x.correct>=0&&x.correct<2)?x.correct:-1};
    })
  };
  const msg=h('div',{class:'err',role:'alert'});
  const list=h('div',{class:'row',style:'flex-direction:column;align-items:stretch'});
  function renderQs(){
    list.replaceChildren(...draft.questions.map((qq,i)=>{
      const qchip=h('span',{class:'chip','aria-hidden':'true'},autoPic(qq.q,true));
      return h('div',{class:'q'},
        h('div',{class:'q-head'},h('b',null,t('questionN',{n:i+1})),
          draft.questions.length>MIN_Q?h('button',{class:'btn ghost small',type:'button',onclick:()=>{draft.questions.splice(i,1);renderQs()}},t('remove')):null),
        h('div',{class:'qrow'},qchip,
          h('input',{type:'text',id:'q'+i,value:qq.q,maxlength:120,'aria-label':t('questionN',{n:i+1}),oninput:e=>{qq.q=e.target.value;qchip.textContent=autoPic(qq.q,true)}})),
        h('span',{class:'hint'},t('tickHint')),
        qq.opts.map((o,j)=>{
          const achip=h('span',{class:'chip','aria-hidden':'true'},autoPic(o.t,false));
          return h('div',{class:'ans'},
            h('div',{class:'opt-edit'},
              h('input',{type:'radio',name:'c'+i,checked:qq.correct===j,'aria-label':t('answerN',{n:j+1}),onchange:()=>{qq.correct=j}}),
              achip,
              h('input',{type:'text',id:'q'+i+'o'+j,value:o.t,maxlength:80,'aria-label':t('answerN',{n:j+1}),placeholder:t('answerN',{n:j+1}),oninput:e=>{o.t=e.target.value;achip.textContent=autoPic(o.t,false)}})));
        }));
    }));
  }
  renderQs();
  const saveBtn=h('button',{class:'btn',onclick:save},t('saveBtn'));
  async function save(){
    msg.textContent='';
    const name=(draft.ownerName||'').trim();
    if(!name){msg.textContent=t('errName');return}
    for(let i=0;i<draft.questions.length;i++){
      const qq=draft.questions[i];
      if(!qq.q.trim()){msg.textContent=t('errQEmpty',{n:i+1});return}
      if(!qq.opts.every(o=>o.t.trim())){msg.textContent=t('errAns',{n:i+1});return}
      if(qq.correct<0){msg.textContent=t('errTick',{n:i+1});return}
    }
    saveBtn.disabled=true;
    const doc={
      ownerId:myId,slug:(existing&&existing.slug)||randSlug(),ownerName:name,
      title:'Quiz about '+name,
      createdAt:(existing&&existing.createdAt)||Date.now(),
      questions:draft.questions.map(qq=>({q:qq.q.trim(),img:'emoji:'+autoPic(qq.q,true),correct:qq.correct,
        opts:qq.opts.map(o=>({t:o.t.trim(),img:'emoji:'+autoPic(o.t,false)}))}))
    };
    try{await db.doc('quizzes/'+myId).set(doc);done(doc)}
    catch(e){saveBtn.disabled=false;msg.textContent=t('errSave')}
  }
  mount(false,h('div',{class:'card'},
    h('h2',null,existing?t('editQuiz'):t('makeQuiz')),
    existing?null:h('p',{class:'lead'},t('builderLead')),
    h('label',{class:'f',for:'oname'},t('yourName'),
      h('input',{type:'text',id:'oname',value:draft.ownerName,maxlength:30,oninput:e=>{draft.ownerName=e.target.value}})),
    list,
    draft.questions.length<MAX_Q?h('button',{class:'btn ghost',type:'button',onclick:()=>{
      const d=DEFAULT_QS[draft.questions.length];
      draft.questions.push(d?defQ(d):normQ({q:'',opts:['','']}));renderQs()}},t('addQ',{n:draft.questions.length,max:MAX_Q})):null,
    msg,
    h('div',{class:'row'},saveBtn,h('button',{class:'btn ghost',onclick:home},t('back')))));
}

/* ---------- Page 3: copy link ---------- */
function done(q){
  clearSubs();curRender=null;
  const input=h('input',{type:'text',readonly:true,value:shareUrl(q.slug),id:'share-url','aria-label':t('copyLink')});
  const cbtn=h('button',{class:'btn small',onclick:()=>copy(shareUrl(q.slug),input,cbtn)},t('copy'));
  mount(false,h('div',{class:'card done'},
    svgBox('bigcat',kitten(KIT_A)),
    h('h2',null,t('ready')),
    h('p',{class:'hint'},t('shareHint')),
    h('div',{class:'share'},input,cbtn),
    h('button',{class:'btn start',onclick:()=>cbtn.click()},t('copyLink')),
    h('div',{class:'row'},
      h('button',{class:'btn ghost small',onclick:()=>builder(q)},t('editQuestions')),
      h('button',{class:'btn ghost small',onclick:home},t('viewBoard')))));
}

/* ---------- Friend side ---------- */
async function play(slug){
  clearSubs();curRender=null;
  mount(true,h('div',{class:'hint'},t('loading')));
  if(!db){
    mount(true,h('div',{class:'card'},h('h2',null,t('signInPlay')),h('p',{class:'lead'},t('signInPlayLead'))));
    return;
  }
  let q=null;
  try{
    const s=await db.collection('quizzes').where('slug','==',slug).limit(1).get();
    if(!s.empty)q=s.docs[0].data();
  }catch(e){}
  if(!q){
    mount(false,h('div',{class:'card'},h('h2',null,t('notFound')),
      h('p',{class:'lead'},t('notFoundLead')),
      h('div',{class:'row'},h('button',{class:'btn ghost',onclick:()=>{location.hash='';}},t('makeOwn')))));
    return;
  }
  if(q.ownerId===myId){
    mount(false,h('div',{class:'card'},h('h2',null,t('ownQuiz')),
      h('p',{class:'lead'},t('ownQuizLead')),
      h('div',{class:'row'},h('button',{class:'btn',onclick:()=>{location.hash='';}},t('goBoard')))));
    return;
  }
  const qs=q.questions.map(normQ);
  const total=qs.length;
  const who=q.ownerName||'me';
  const answers=[];
  let nick=null;

  function front(){
    clearSubs();curRender=front;
    const board=h('div');
    mount(true,
      hero({title:tr('titleFriend',{who}),sub:tr('subFriend',{who}),onCta:nameStep}),
      scoreboard(board));
    watchAttempts(q.slug,total,board);
  }
  function nameStep(){
    clearSubs();curRender=null;
    const input=h('input',{type:'text',id:'nick',maxlength:24,placeholder:t('namePh'),value:nick||''});
    const nmsg=h('div',{class:'err',role:'alert'});
    mount(false,h('div',{class:'card'},
      h('span',{class:'eyebrow'},t('nameEyebrow',{n:total,who})),
      h('h2',null,t('callYou')),
      h('label',{class:'f',for:'nick'},t('yourNameLbl'),input),
      nmsg,
      h('div',{class:'row'},
        h('button',{class:'btn',onclick:()=>{
          if(!input.value.trim()){nmsg.textContent=t('errNick',{who});return}
          nick=input.value.trim();answers.length=0;ask(0);
        }},t('letsGo')),
        h('button',{class:'btn ghost',onclick:front},t('back')))));
  }
  function optBody(o){return [o.img?picNode(o.img,''):null,o.t?h('span',null,o.t):null]}
  function ask(i){
    const qq=qs[i];
    let picked=null;
    const nextBtn=h('button',{class:'btn',disabled:true,onclick:()=>{answers.push(picked);i+1<total?ask(i+1):finish()}},t(i+1<total?'next':'seeScore'));
    const btns=qq.opts.map((o,j)=>(o.t||o.img)?h('button',{class:'opt',onclick:()=>{
      picked=j;btns.forEach((b,k)=>b&&b.classList.toggle('sel',k===j));nextBtn.disabled=false;
    }},optBody(o)):null);
    const anyImg=qq.opts.some(o=>o.img);
    mount(false,h('div',{class:'card'},
      h('div',{class:'progress',role:'progressbar','aria-valuemin':0,'aria-valuemax':total,'aria-valuenow':i},h('i',{style:'width:'+(i/total*100)+'%'})),
      h('span',{class:'eyebrow'},t('qOf',{i:i+1,n:total})),
      h('h2',null,qq.q),
      qq.img?picNode(qq.img,'qimg'):null,
      h('div',{class:'opts'+(anyImg?' withimg':'')},btns),
      h('div',{class:'row'},nextBtn)));
  }
  async function finish(){
    const score=answers.filter((a,i)=>a===qs[i].correct).length;
    const board=h('div');
    const saveMsg=h('div',{class:'hint'},t('saving'));
    const label=o=>o?(o.t||t('picture')):'';
    const win=total>0&&score/total>=0.6;
    mount(false,h('div',{class:'card done'},
        svgBox('scene',win?hugScene():sadScene()),
        h('span',{class:'eyebrow'},t('yourScore')),
        h('div',{class:'score'},score+'/'+total),
        h('p',{class:'lead'},t(win?'winMsg':'loseMsg',{who})),
        saveMsg),
      scoreboard(board),
      h('div',{class:'card'},h('h2',null,t('yourAnswers')),
        qs.map((qq,i)=>{
          const ok=answers[i]===qq.correct;
          return h('div',{class:'review'},
            h('b',null,qq.q),
            h('div',null,h('span',{class:'tag '+(ok?'good':'bad')},t(ok?'right':'missed')),' '+t('youSaid')+label(qq.opts[answers[i]])),
            ok?null:h('div',{class:'hint'},t('correctAns')+label(qq.opts[qq.correct])));
        })),
      h('div',{class:'card'},h('h3',null,t('stump')),
        h('div',{class:'row'},h('button',{class:'btn',onclick:()=>{location.hash='';}},t('makeOwn')))));
    try{
      await db.collection('attempts').add({slug:q.slug,takerId:myId,name:nick,score,total,createdAt:Date.now()});
      saveMsg.textContent=t('saved');
    }catch(e){saveMsg.textContent=t('saveFail')}
    watchAttempts(q.slug,total,board);
  }
  front();
}

/* ---------- Routing ---------- */
function route(){
  const m=/^#play-([a-z0-9]+)$/.exec(location.hash);
  m?play(m[1]):home();
}
async function boot(){
  document.body.insertAdjacentHTML('afterbegin',DOODLES);
  mount(false,h('div',{class:'hint'},t('loading')));
  try{
    const be=await window.RO_BACKEND();
    db=be.db;myId=be.uid;myName=be.name||'';
  }catch(e){console.error(e)}
  route();
  window.addEventListener('hashchange',route);
}
boot();
})();
