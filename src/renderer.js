// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

var body = document.body;
var btnChangeTheme = document.getElementById('btnChangeTheme');

function changeTheme(theme){
    body.classList.add('color-transition');

    if(theme == 'dark'){
        body.classList.remove("theme-light");
    }else if(theme == 'light'){
        body.classList.add("theme-light");
    }else if(theme == 'toggle'){
        body.classList.toggle("theme-light");
    }

    setTimeout(() => {
        body.classList.remove('color-transition');
    }, 1000);
}

function isLightTheme(){
    return body.classList.contains("theme-light");
}

window.addEventListener('DOMContentLoaded', () => {
    // document.getElementById('fleme').style = "display: none; width: 100%; height: calc(100% - 23px);";
    // document.getElementById('flemeIframe').style = "width: 100%; height: 100%;";

    document.getElementById('btnRememberToken').addEventListener('change', (e) =>{
        // console.log(e.target.checked);
        if(!e.target.checked){
            document.getElementById('btnNeedPassword').classList.add('hidden');
            document.getElementById('btnSetPassword').checked = false;
            document.getElementById('btnSetPassword').dispatchEvent(new Event("change"));
        }
        else{
            document.getElementById('btnNeedPassword').classList.remove('hidden');
        }
    })

    document.getElementById('btnSetPassword').addEventListener('change', (e) => {
        if(!e.target.checked){
            document.getElementById('inputPassword').parentNode.parentNode.classList.add('hidden')
        }
        else{
            document.getElementById('inputPassword').parentNode.parentNode.classList.remove('hidden');
        }
    })
})

// function toFleme(){
//     let fleme = document.getElementById('fleme'),
//         flemeIframe = document.getElementById('flemeIframe'),
//         appMount = document.getElementById('appMount');
//     if(fleme.style.display == 'block'){
//       flemeIframe.src = "";
//       fleme.style.display = "none";
//       appMount.style.display = ""
//     }else{
//       appMount.style.display = "none"
//       fleme.style.display = "block";
//       flemeIframe.src = "https://fleme.nedius.com";
//     }
//   }

var guildContainer = document.getElementById('guildContainer'),
    channelContainer = document.getElementById('channelContainer'),
    navigation = document.getElementById('navigation'),
    appMount = document.getElementById('appMount'),
    appLogin = document.getElementById('appLogin');

function addGuild(guild){
    if(guild == undefined)
        return;

    if(document.getElementById(guild.id)) delGuild(guild);

    let guildImg = document.createElement('img'),
        guildWrapper = document.createElement('div'),
        guildListItem = document.createElement('div');

    guildImg.classList.add('guildImage');
    guildImg.alt = guild.name;
    guildImg.setAttribute("draggable", "false");

    if(typeof(guild.iconURL) == "string" )
        guildImg.src = guild.iconURL;
    else{
        // guildImg.alt = guild.nameAcronym;
        // guildImg.style.backgroundColor = 'var(--background-secondary)';
        guildImg.src = "./img/placeholder.png";
    }

    guildWrapper.classList.add('wrapper');

    guildListItem.classList.add('listItem');
    guildListItem.id = 'gd/' + guild.id;
    // guildListItem.setAttribute('data-title', guild.name);
    
    guildWrapper.append(guildImg);
    guildListItem.append(guildWrapper);

    guildContainer.append(guildListItem);
}

function delGuild(guild){
    if(guild == undefined)
        return;

    let guildListItem = document.getElementById('gd/' + guild.id);

    if(guildListItem != undefined)
        // guildListItem.parentNode.removeChild(guildListItem);
        guildListItem.remove();
}

function delGuilds(){
    // var node = guildContainer.childNodes;
    // for(var i=node.length;i<0;i++){
    //     if(node[i].id && node[i].id != ''){
    //         var div = document.getElementById(node[i].id);
    //         div.parentNode.removeChild(div);
    //     }
    // }

    // guildContainer.children.forEach(node => {
    //     if(node.id && node.id != '') node.parentNode.removeChild(node);
    // });

    // for(node of guildContainer.children){
    //     if(node.id) console.log(node.id);   
    // }

    // for(node of guildContainer.children){
    //     var ndoe = guildContainer.children
    //     console.log(node);
    //     if(node.id){
    //         console.log(`tryin to delete '${node.id}'`);
    //         node.remove();
    //         // var el = document.getElementById(node.id);
    //         // el.parentNode.removeChild(el);   
    //     }
    // }

    // guildContainer.lastChild.remove();

    guildContainer.innerHTML =  `<div class="listItem"><div class="wrapper"><img class="guildImage" draggable="false" src="./img/placeholder.png" alt="guild"></div></div>`+
                                `<div class="listItem"><div class="guildSeparator"></div></div>`;
}

function addChannel(channel, callback, callbackForChat){
    if(channel == undefined)
        return;

    let element;

    if(channel.type == 'text'){ //addChannel({type:'text', name:'test', id: 1});
        let svg = document.createElement('svg'),
            gear = document.createElement('svg'),
            sidebarChannelName = document.createElement('div'),
            sidebarChannelNameOption = document.createElement('div'),
            sidebarChannelNameOptionWrapper = document.createElement('div'),
            sidebarChannelContent = document.createElement('div'),
            sidebarChannelWrapper = document.createElement('div'),
            sidebarChannelContainer = document.createElement('div');

        sidebarChannelName.classList.add('sidebarChannelName');
        sidebarChannelName.innerText = channel.name;

        sidebarChannelNameOptionWrapper.classList.add('sidebarChannelNameOptionWrapper');

        sidebarChannelNameOption.classList.add('sidebarChannelNameOption');
        sidebarChannelNameOption.id = 'ch/' + channel.id;
        // sidebarChannelNameOption.innerText = ':';
        sidebarChannelNameOption.addEventListener('click', callback);

        svg = document.createRange().createContextualFragment(`<svg width="24" height="24" viewBox="0 0 24 24" class="sidebarChannelContentIcon"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>`);
        gear = document.createRange().createContextualFragment(`<svg name="Gear" aria-hidden="false" width="20" height="20" viewBox="0 0 24 24" ><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"></path></svg>`);

        sidebarChannelContent.classList.add('sidebarChannelContent');
        sidebarChannelWrapper.classList.add('sidebarChannelWrapper');
        sidebarChannelContainer.classList.add('sidebarChannelContainer');

        sidebarChannelContent.append(svg);
        sidebarChannelContent.append(sidebarChannelName);
        sidebarChannelNameOptionWrapper.append(gear);
        sidebarChannelNameOptionWrapper.append(sidebarChannelNameOption);
        sidebarChannelContent.append(sidebarChannelNameOptionWrapper);
        // sidebarChannelContent.append(gear);
        // sidebarChannelContent.getElementsByClassName('sidebarChannelNameOptionWrapper')[0].id = 'ch/' + channel.id;
        // sidebarChannelContent.getElementsByClassName('sidebarChannelNameOptionWrapper')[0].addEventListener('click', callback);
        sidebarChannelWrapper.append(sidebarChannelContent);
        sidebarChannelContainer.append(sidebarChannelWrapper);

        sidebarChannelContainer.id = 'chc/' + channel.id;
        sidebarChannelContainer.addEventListener('click', callbackForChat);

        element = sidebarChannelContainer;
    }
    if(channel.type == 'voice'){ //addChannel({type:'voice', name:'test', id: 1})
        let svg = document.createElement('svg'),
            sidebarChannelName = document.createElement('div'),
            sidebarChannelContent = document.createElement('div'),
            sidebarChannelWrapper = document.createElement('div'),
            sidebarChannelContainer = document.createElement('div');

        sidebarChannelName.classList.add('sidebarChannelName');
        sidebarChannelName.innerText = channel.name;

        svg = document.createRange().createContextualFragment(`<svg width="24" height="24" viewBox="0 0 24 24" class="sidebarChannelContentIcon"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29604L6 8.00204H3C2.45 8.00204 2 8.45304 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.71C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59904 11.757 3.23204 11.383 3.07904ZM14 5.00195V7.00195C16.757 7.00195 19 9.24595 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 8.14295 17.86 5.00195 14 5.00195ZM14 9.00195C15.654 9.00195 17 10.349 17 12.002C17 13.657 15.654 15.002 14 15.002V13.002C14.551 13.002 15 12.553 15 12.002C15 11.451 14.551 11.002 14 11.002V9.00195Z"></path></svg>`);

        sidebarChannelContent.classList.add('sidebarChannelContent');
        sidebarChannelWrapper.classList.add('sidebarChannelWrapper');
        sidebarChannelContainer.classList.add('sidebarChannelContainer');

        sidebarChannelContent.append(svg);
        sidebarChannelContent.append(sidebarChannelName);
        sidebarChannelWrapper.append(sidebarChannelContent);
        sidebarChannelContainer.append(sidebarChannelWrapper);

        sidebarChannelContainer.id = 'ch/' + channel.id;
        sidebarChannelContainer.addEventListener('click', callback);

        element = sidebarChannelContainer;

    }
    if(channel.type == 'category'){ //addChannel({type:'category', name:'test', id: 1})
        let svg = document.createElement('svg'),
            header = document.createElement('header'),
            sidebarCategoryWrapper = document.createElement('div'),
            sidebarCategoryContainer = document.createElement('div');

        header.classList.add('sidebarCategoryName');
        header.innerText = channel.name;

        svg = document.createRange().createContextualFragment(`<svg class="sidebarCategoryIcon" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"></path></svg>`);

        sidebarCategoryWrapper.classList.add('sidebarCategoryWrapper');
        sidebarCategoryContainer.classList.add('sidebarCategoryContainer');
        sidebarCategoryContainer.classList.add('selectable');


        sidebarCategoryWrapper.append(svg);
        sidebarCategoryWrapper.append(header);
        sidebarCategoryContainer.append(sidebarCategoryWrapper);
        
        sidebarCategoryContainer.id = 'ch/' + channel.id;
        sidebarCategoryContainer.addEventListener('click', callback);
        
        element = sidebarCategoryContainer;
    }
    
    // console.log(channel);
    // console.log(element);
    channelContainer.append(element);
}

function delChannels(){
    channelContainer.innerHTML = "";
}

function addVoiceUser(channel, user){
    if(channel == undefined || user == undefined)
        return;

    if(document.getElementById(`vmb/${user.id}`) != undefined)
        delVoiceUser(user, true);

    let channelDiv = document.getElementById('ch/' + channel.id),
        sidebarChannelList = channelDiv.getElementsByClassName('sidebarChannelList')[0],
        voiceUser = document.createElement('div'),
        voiceUserContent = document.createElement('div'),
        voiceUserAvatarContainer = document.createElement('div'),
        img = document.createElement('img'),
        voiceUsername = document.createElement('div'),
        voiceUserIcons = document.createElement("div");
        // voiceUserIcons = document.createElement('div'),
        // voiceUserIconsSpacing = document.createElement('div');

    let hasList = true;

    if(channelDiv == undefined)
        return;

    if(sidebarChannelList == undefined){
        sidebarChannelList = document.createElement('div');
        sidebarChannelList.classList.add('sidebarChannelList');
        hasList = false;
    }

    // https://cdn.discordapp.com/avatars/281478128629579776/8b34a214391087454e6d302c488379d4.png?size=2048
    let avatarUrl = user.user.displayAvatarURL;
    if( avatarUrl.indexOf('?size') )
        avatarUrl = avatarUrl.substring(0, avatarUrl.indexOf('?')) + '?size=64';


    img.src = avatarUrl;
    // console.log(user.user.avatarURL, '\n', user.user.displayAvatarURL);

    img.alt = user.user.username + " avatar";
    img.width = 24;
    img.height = 24;

    voiceUserAvatarContainer.classList.add('voiceUserAvatarContainer');


    voiceUsername.classList.add('voiceUsername');
    voiceUsername.innerText = user.nickname != null ? user.nickname : user.user.username;

    voiceUserIcons.classList.add('voiceUserIcons');

    voiceUserContent.classList.add('voiceUserContent');
    voiceUser.classList.add('voiceUser');
    voiceUser.id = `vmb/${user.id}`;

    voiceUserAvatarContainer.append(img)
    voiceUserContent.append(voiceUserAvatarContainer);
    voiceUserContent.append(voiceUsername);
    voiceUserContent.append(voiceUserIcons);

    voiceUser.append(voiceUserContent);
    sidebarChannelList.append(voiceUser);

    if(!hasList)
        channelDiv.append(sidebarChannelList);

    // document.getElementById(channel.id).append(sidebarChannelList);

    //   <div class="sidebarChannelList">

    //     <div class="voiceUser">
    //       <div class="voiceUserContent">
    //         <div class="voiceUserAvatarContainer">
    //           <img src="./img/placeholder.png" alt="user avatar" width="24" height="24">
    //         </div>
    //         <div class="voiceUsername">
    //           user name
    //         </div>

    //         <div class="voiceUserIcons">
    //           <div class="voiceUserIconsSpacing">
    //             <svg name="Nova_MicrophoneMute" class="voiceUserIcon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
    //               <path d="M6.7 11H5C5 12.19 5.34 13.3 5.9 14.28L7.13 13.05C6.86 12.43 6.7 11.74 6.7 11Z" fill="currentColor"></path>
    //               <path d="M9.01 11.085C9.015 11.1125 9.02 11.14 9.02 11.17L15 5.18V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 11.03 9.005 11.0575 9.01 11.085Z" fill="currentColor"></path>
    //               <path d="M11.7237 16.0927L10.9632 16.8531L10.2533 17.5688C10.4978 17.633 10.747 17.6839 11 17.72V22H13V17.72C16.28 17.23 19 14.41 19 11H17.3C17.3 14 14.76 16.1 12 16.1C11.9076 16.1 11.8155 16.0975 11.7237 16.0927Z" fill="currentColor"></path>
    //               <path d="M21 4.27L19.73 3L3 19.73L4.27 21L8.46 16.82L9.69 15.58L11.35 13.92L14.99 10.28L21 4.27Z" fill="currentColor"></path>
    //             </svg>
    //           </div>

    //           <div class="voiceUserIconsSpacing">
    //             <svg name="Nova_HeadsetDeafen" class="voiceUserIcon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
    //               <path d="M6.16204 15.0065C6.10859 15.0022 6.05455 15 6 15H4V12C4 7.588 7.589 4 12 4C13.4809 4 14.8691 4.40439 16.0599 5.10859L17.5102 3.65835C15.9292 2.61064 14.0346 2 12 2C6.486 2 2 6.485 2 12V19.1685L6.16204 15.0065Z" fill="currentColor"></path>
    //               <path d="M19.725 9.91686C19.9043 10.5813 20 11.2796 20 12V15H18C16.896 15 16 15.896 16 17V20C16 21.104 16.896 22 18 22H20C21.105 22 22 21.104 22 20V12C22 10.7075 21.7536 9.47149 21.3053 8.33658L19.725 9.91686Z" fill="currentColor"></path>
    //               <path d="M3.20101 23.6243L1.7868 22.2101L21.5858 2.41113L23 3.82535L3.20101 23.6243Z" fill="currentColor"></path>
    //             </svg>
    //           </div>
    //         </div>

    //       </div>
    //     </div>

    //   </div>
}

function delVoiceUser(user, changingServer = false){
    if(user == undefined)
        return;
    
    let voiceUser = document.getElementById(`vmb/${user.id}`),
        list = voiceUser.parentNode;

    if(voiceUser != undefined)
        voiceUser.parentNode.removeChild(voiceUser);

    if(!list.hasChildNodes() && changingServer)
        list.remove();
    
}

function setDeaf(user, state){
    if(user == undefined || state == undefined)
        return;

    let voiceUser = document.getElementById(`vmb/${user.id}`),
        voiceUserIcons = voiceUser.getElementsByClassName('voiceUserIcons')[0],
        voiceUserIconsSpacing = document.createElement('div'),
        svg = document.createElement('svg');

    if(voiceUser == undefined)
        return;

    if(state){
        if(voiceUser.querySelector('#Nova_HeadsetDeafen') !== null)
            return;
        voiceUserIconsSpacing.classList.add('voiceUserIconsSpacing');
        svg = document.createRange().createContextualFragment(`<svg id="Nova_HeadsetDeafen" class="voiceUserIcon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path d="M6.16204 15.0065C6.10859 15.0022 6.05455 15 6 15H4V12C4 7.588 7.589 4 12 4C13.4809 4 14.8691 4.40439 16.0599 5.10859L17.5102 3.65835C15.9292 2.61064 14.0346 2 12 2C6.486 2 2 6.485 2 12V19.1685L6.16204 15.0065Z" fill="currentColor"></path><path d="M19.725 9.91686C19.9043 10.5813 20 11.2796 20 12V15H18C16.896 15 16 15.896 16 17V20C16 21.104 16.896 22 18 22H20C21.105 22 22 21.104 22 20V12C22 10.7075 21.7536 9.47149 21.3053 8.33658L19.725 9.91686Z" fill="currentColor"></path><path d="M3.20101 23.6243L1.7868 22.2101L21.5858 2.41113L23 3.82535L3.20101 23.6243Z" fill="currentColor"></path></svg>`);
        voiceUserIconsSpacing.append(svg);
        if(user.serverDeaf) voiceUserIconsSpacing.children[0].style.color = '#f04747';
        voiceUserIcons.append(voiceUserIconsSpacing);
    }else{
        let icon = voiceUser.querySelector('#Nova_HeadsetDeafen');
        if(icon != null) icon.parentNode.parentNode.removeChild(icon.parentNode);
    } 
}

function setMute(user, state){
    if(user == undefined || state == undefined)
        return;

    let voiceUser = document.getElementById(`vmb/${user.id}`),
        voiceUserIcons = voiceUser.getElementsByClassName('voiceUserIcons')[0],
        voiceUserIconsSpacing = document.createElement('div'),
        svg = document.createElement('svg');

    if(voiceUser == undefined)
        return;

    // console.log(user, state);

    if(user.guild.afkChannelID === user.voiceChannelID)
        state = true;

    if(state){
        if(voiceUser.querySelector('#Nova_MicrophoneMute') !== null)
            return;
        voiceUserIconsSpacing.classList.add('voiceUserIconsSpacing');
        svg = document.createRange().createContextualFragment(`<svg id="Nova_MicrophoneMute" class="voiceUserIcon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path d="M6.7 11H5C5 12.19 5.34 13.3 5.9 14.28L7.13 13.05C6.86 12.43 6.7 11.74 6.7 11Z" fill="currentColor"></path><path d="M9.01 11.085C9.015 11.1125 9.02 11.14 9.02 11.17L15 5.18V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 11.03 9.005 11.0575 9.01 11.085Z" fill="currentColor"></path><path d="M11.7237 16.0927L10.9632 16.8531L10.2533 17.5688C10.4978 17.633 10.747 17.6839 11 17.72V22H13V17.72C16.28 17.23 19 14.41 19 11H17.3C17.3 14 14.76 16.1 12 16.1C11.9076 16.1 11.8155 16.0975 11.7237 16.0927Z" fill="currentColor"></path><path d="M21 4.27L19.73 3L3 19.73L4.27 21L8.46 16.82L9.69 15.58L11.35 13.92L14.99 10.28L21 4.27Z" fill="currentColor"></path></svg>`);
        voiceUserIconsSpacing.append(svg);
        if(user.serverMute) voiceUserIconsSpacing.children[0].style.color = '#f04747';
        voiceUserIcons.insertBefore(voiceUserIconsSpacing, voiceUserIcons.firstChild);
    }else{
        let icon = voiceUser.querySelector('#Nova_MicrophoneMute');
        if(icon != null) icon.parentNode.parentNode.removeChild(icon.parentNode);
    }   
}

function setGoLive(user, state){
    if(user == undefined || state == undefined)
        return;

    let voiceUser = document.getElementById(`vmb/${user.id}`),
        voiceUserIcons = voiceUser.getElementsByClassName('voiceUserIcons')[0],
        voiceUserIconsSpacing = document.createElement('div'),
        div = document.createElement('div'); // liveTag

    if(voiceUser == undefined)
        return;

    if(state){
        if(voiceUser.querySelector('.liveTag') !== null)
            return;
        voiceUserIconsSpacing.classList.add('voiceUserIconsSpacing');
        div.classList.add('liveTag');
        div.innerText = 'Live';
        voiceUserIconsSpacing.append(div);
        voiceUserIcons.insertBefore(voiceUserIconsSpacing, voiceUserIcons.firstChild);
    }else{
        let icon = voiceUser.querySelector('.liveTag');
        if(icon != null) icon.parentNode.parentNode.removeChild(icon.parentNode);
    }   
}

function setClientUser(user){
    var username = document.getElementsByClassName('nameTagUsername')[0],
        userTag = document.getElementsByClassName('nameTagUserId')[0],
        userImage = document.getElementById('userImage');

    username.innerText = user.username;
    userTag.innerText = '#' + user.discriminator;
    // userTag.innerText = (user.tag).substring(user.username.length);
    userImage.src = user.avatarURL.substring(0, user.avatarURL.indexOf('?')) + '?size=64';;

    if(!user.bot){
        document.getElementById('clientBotTag').innerText = 'user';
        document.getElementById('clientBotTag').style.background = '#f04747';
    }else{
        document.getElementById('clientBotTag').innerText = 'bot';
        document.getElementById('clientBotTag').style.background = '';
    }
}

function goToLogin(onlyPassword = false){
    clearLoginWarning();
    appMount.classList.add('hidden');
    appLogin.classList.remove('hidden');
    navigation.classList.add('theme-light');
    if(onlyPassword){
        document.querySelector('.authBlock').classList.add('hidden');
        document.getElementById('inputPassword').parentNode.parentNode.classList.remove('hidden');
    }
    document.getElementById('blobHere').appendChild(canvas);
    loopAnimation = true;
    loop();
}

function goToApp(){
    appMount.classList.remove('hidden');
    appLogin.classList.add('hidden');
    navigation.classList.remove('theme-light');
    document.getElementById('blobHere').innerHTML = "";
    unloop();
}

function logout(){
    window.postMessage({
        logout: true,
      });
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function setLoginWarning(reason = '', red = false){
    if(red)
        document.getElementById('authSubTitle').style.color = '#f04747';
    else
        document.getElementById('authSubTitle').style.color = '';

    if(reason == '')
        randomMotd();
    else
        document.getElementById('authSubTitle').innerText = reason;
}
  
function clearLoginWarning(reason = ''){
    setLoginWarning(reason);
}
  
function randomMotd(){
    var reason = motd[random(0, motd.length-1)];
    document.getElementById('authSubTitle').innerText = reason;
}

function addChatOpDeprecated(channel, data, method = ''){
    let chatContent = document.getElementById('chatContent'),
    name = document.createElement('span'),
    input = document.createElement('input'),
    btn = document.createElement('button'),
    div = document.createElement('div'),
    separator = document.createElement('div');
    
    // console.log(channel, data, method);

    if(channel[data] == '__SEPARATOR'){
        separator.classList.add('channelOptionSeparator');
        chatContent.append(separator)
        return;
    }

    name.classList.add('channelOptionName');
    name.innerText = `${data}`;

    input.classList.add('channelOptionInput');
    input.value = channel[data];
    if(method=='') input.readOnly = true;
    input.type = typeof(channel[data]);

    btn.classList.add('channelOptionButton');
    btn.innerText = 'Save';

    if(data === 'id'){
        btn.innerText = 'Copy';
        btn.style.backgroundColor = '#43b581';

        btn.addEventListener('click', (e) =>{
            let value = e.target.parentNode.children[1].value;

            navigator.clipboard.writeText(value).then(function() {
                // console.log('Async: Copying to clipboard was successful!');
              }, function(err) {
                console.error('Async: Could not copy text: ', err);
              });
        });
    }

    div.classList.add('channelOption');
    div.setAttribute('channel', channel.id);
    div.setAttribute('guild', channel.guild.id);
    if(method !== '')
        div.setAttribute('method', method);
    div.setAttribute('originalValue', channel[data]);

    separator.classList.add('channelOptionSeparator');

    div.append(name);
    div.append(input);
    if(method!=='' || data==='id') div.append(btn);

    chatContent.append(div);

    // console.log(data);
    // console.log(data, '(', typeof(channel[data]) , ')', ': ',  channel[data]);
    // if(method!='')
    //     document.getElementById('chatContent').innerHTML += `<p class="red">${data}: ${channel[data]} [method: ${method}] </p><br>`;
    // else
    //     document.getElementById('chatContent').innerHTML += `<p>${data}: ${channel[data]} </p><br>`;
}

function clearChat(){ 
    document.getElementById('chatContent').innerHTML = '';
    document.getElementById('chatContent').style = 'overflow-y: scroll;';
}

/* obj for function */

let someRandomObj =
[
    { type: 'separator' },
    { type: 'input', channel: {}, data: '', method: '', callback: ()=>{} },
    { type: 'btngroup', channel: {}, btns:[ { type: 'toggle', name: 'a/b', method:'', callback: ()=>{} },
                                            { type: 'btn', name: 'c', method:'', enable: true, callback: ()=>{} } ]},
];

function addChatOp(options){
    // console.log(options);

    for(option of options){
        switch(option.type){
            case 'separator':{
                let chatContent = document.getElementById('chatContent'),
                separator = document.createElement('div');

                separator.classList.add('channelOptionSeparator');
                chatContent.append(separator)
                break;
            }
            case 'input':{
                let chatContent = document.getElementById('chatContent'),
                name = document.createElement('span'),
                input = document.createElement('input'),
                btn = document.createElement('button'),
                div = document.createElement('div');

                name.classList.add('channelOptionName');
                name.innerText = `${option.data}`;
            
                input.classList.add('channelOptionInput');
                input.value = option.channel[option.data];
                if(option.method=='' || !option.method) input.readOnly = true;
                input.type = typeof(option.channel[option.data]);
            
                btn.classList.add('channelOptionButton');
                btn.innerText = 'Save';

                if(option.data === 'id' || option.data === 'afkChannelID'){
                    btn.innerText = 'Copy';
                    btn.style.backgroundColor = '#43b581';
            
                    btn.addEventListener('click', (e) =>{
                        let value = e.target.parentNode.children[1].value;
            
                        navigator.clipboard.writeText(value).then(function() {
                            // console.log('Async: Copying to clipboard was successful!');
                          }, function(err) {
                            console.error('Async: Could not copy text: ', err);
                          });
                    });
                }else if(option.callback){
                    btn.addEventListener('click', option.callback);
                }
            
                div.classList.add('channelOption');
                div.setAttribute('channel', option.channel.id);
                if(option.channel.guild) div.setAttribute('guild', option.channel.guild.id);
                // if(option.channel.region) div.setAttribute('guild', option.id);
                if(option.method !== '' || option.method !== undefined)
                    div.setAttribute('method', option.method);
                div.setAttribute('originalValue', option.channel[option.data]);
            
                div.append(name);
                div.append(input);
                if((option.method !== '' && option.method !== undefined) || option.data==='id' || option.data==='afkChannelID') div.append(btn);
            
                chatContent.append(div);

                break;
            }
            case 'btngroup':{
                let chatContent = document.getElementById('chatContent'),
                    chatBtnGroup = document.createElement('div'),
                    btn = document.createElement('button');

                chatBtnGroup.classList.add('chatBtnGroup');
                btn.classList.add('channelOptionButton');
                btn.classList.add('chatBtn');

                // console.log(option);

                for(op of option.btns){
                    let localBtn = btn.cloneNode();

                    localBtn.innerText = op.name;

                    localBtn.setAttribute('channel', option.member.id);
                    localBtn.setAttribute('guild', option.member.voiceChannel.guild.id);
                    if(op.method !== '' || op.method !== undefined)
                        localBtn.setAttribute('method', op.method);
                    localBtn.setAttribute('originalValue', op.state);

                    localBtn.setAttribute('opBtn', '');

                    if(op.callback) localBtn.addEventListener('click', op.callback);
                    if(op.state) localBtn.innerText = `Un${op.name.toLowerCase()}`;
                    // if(op.type === 'toggle'){
                    //     localBtn;
                    //     localBtn.addEventListener('click', btnToggle);
                    // }
                    if(op.disabled) localBtn.disabled = op.disabled;

                    chatBtnGroup.append(localBtn);
                }

                chatContent.append(chatBtnGroup);

                break;
            }
        }
    }
}

function error(content = ''){
    let taskbar = document.getElementById('taskbar'),
        taskbarBtn = document.getElementById('btnAppAuthor'),
        taskbarContent = document.getElementById('taskbarError');
    
    taskbarContent.classList.add('error')
    taskbarContent.innerText = content;

    if(content !== '')
        taskbarBtn.classList.add('error');
    else
        taskbarBtn.classList.remove('error');
    // taskbarBtn.click();
    taskbar.classList.add('openTask');
}

function log(content = ''){
    let taskbar = document.getElementById('taskbar'),
        taskbarBtn = document.getElementById('btnAppAuthor'),
        taskbarContent = document.getElementById('taskbarError');

    taskbarContent.classList.remove('error')
    taskbarContent.innerText = content;

    taskbarBtn.classList.remove('error');
    taskbarBtn.click();
}

function clearTaskBar(content = ''){
    let taskbar = document.getElementById('taskbar'),
        taskbarBtn = document.getElementById('btnAppAuthor'),
        taskbarContent = document.getElementById('taskbarError');

    taskbarContent.classList.remove('error');
    taskbarContent.innerText = '';

    taskbarBtn.classList.remove('error');
    // taskbarBtn.click();;
    taskbar.classList.remove('closeTask');
    taskbar.classList.remove('openTask');
}

function addMemeber(user){
    // console.log(user)
    let memberDiv = document.getElementById('memberDiv'),
        member = document.createElement('div'),
        memberLayout = document.createElement('div'),
        memberAvatar = document.createElement('div'),
        memberAvatarWrapper = document.createElement('div'),
        memberAvatarMask = document.createElement('img'),
        memberContent = document.createElement('div'),
        memberName = document.createElement('div'),
        memberSubText = document.createElement('div'),
        memberActivity = document.createElement('div'),
        memberGroup = document.createElement('header'),
        botTag = document.createElement('span');

    if(user.presence.status !== 'offline'){
        if(user.hoistRole){
            if(!document.getElementById(`rl/${user.hoistRole.id}`)){
                memberGroup.classList.add('memberGroup');
                memberGroup.id = `rl/${user.hoistRole.id}`;
                memberGroup.innerText = `${user.hoistRole.name} - ${user.hoistRole.members.filter(member => member.presence.status !== 'offline' && member.hoistRole === user.hoistRole).size}`;
                // memberGroup.innerText = `${user.hoistRole !== null ? user.hoistRole.name : user.highestRole.name} - ${user.highestRole.members.size}`;

                memberDiv.append(memberGroup);
            }
        }else{
            if(!document.getElementById(`rl/${user.highestRole.id}`) && user.highestRole.hoist){// && user.highestRole.name !== '@everyone'){
                memberGroup.classList.add('memberGroup');
                memberGroup.id = `rl/${user.highestRole.id}`;
                memberGroup.innerText = `${user.highestRole.name === '@everyone' ? 'online' : user.highestRole.name} - ${user.highestRole.members.filter(member => member.presence.status !== 'offline' && member.hoistRole === null).size}`;
                
                memberDiv.append(memberGroup);
            }else{
                if(!document.getElementById(`rl/online`)){
                    memberGroup.classList.add('memberGroup');
                    memberGroup.id = `rl/online`;
                    memberGroup.innerText = `online - ${user.guild.members.filter(member => !member.hoistRole && !member.highestRole.hoist && member.presence.status !== 'offline').size}`;
                    
                    memberDiv.append(memberGroup);
                }
            }
        }
    }else{
        if(!document.getElementById(`rl/offline`)){
            memberGroup.classList.add('memberGroup');
            memberGroup.id = `rl/offline`;
            // console.log(user)
            memberGroup.innerText = `offline - ${user.guild.members.filter(member => member.presence.status === 'offline').size}`;
            
            memberDiv.append(memberGroup);
        }
    }

    member.classList.add('member');
    member.id = `mb/${user.id}`;
    member.setAttribute('guild', user.guild.id);
    memberLayout.classList.add('memberLayout');
    memberAvatar.classList.add('memberAvatar');
    memberAvatarWrapper.classList.add('memberAvatarWrapper');
    memberAvatarMask.classList.add('memberAvatarMask');
    memberContent.classList.add('memberContent');
    memberName.classList.add('memberName');
    memberSubText.classList.add('memberSubText');
    memberActivity.classList.add('memberActivity');

    let status = '';

    if(user.presence.game){
        switch(user.presence.game.type){
            case 0: { status = 'Playing'; break; }
            case 1: { status = 'Streaming'; break; }
            case 2: { status = 'Listening'; break; }
            case 3: { status = 'Watching'; break; }
            case 4: { status = ''; break; } //custom
            default : status = '';
        }

        if(user.presence.game.name !== 'Custom Status')
            status += ` ${user.presence.game.name}`;
        else
            status += ` ${user.presence.game.state}`;

    }

    memberActivity.innerText = status;

    botTag.classList.add('botTag');
    botTag.innerText = 'bot';

    memberSubText.append(memberActivity);
    memberName.innerText = user.nickname != null ? user.nickname : user.user.username;

    if(user.colorRole) memberName.style.color = user.colorRole.hexColor;

    // console.log(user)

    if(user.user.bot) memberName.append(botTag);
    memberContent.append(memberName);
    memberContent.append(memberSubText);

    let avatarUrl = user.user.displayAvatarURL;
    if( avatarUrl.indexOf('?size') )
        avatarUrl = avatarUrl.substring(0, avatarUrl.indexOf('?')) + '?size=64';

    // memberAvatarMask
    let memberAvatarMaskActivity = memberAvatarMask.cloneNode();
    // memberAvatarMaskActivity.width = '64px';
    // memberAvatarMaskActivity.height = '64px';
    memberAvatarMaskActivity.src = `./img/${user.presence.status}.png`;
    memberAvatarMaskActivity.style = 'border-radius: 0;';

    memberAvatarMask.src = avatarUrl !== '?size=64' ? avatarUrl : './img/placeholder.png';

    memberAvatarMask.alt = user.user.username + ' avatar';
    memberAvatarWrapper.append(memberAvatarMask);
    if(user.presence.status !== 'offline') memberAvatarWrapper.append(memberAvatarMaskActivity);
    memberAvatar.append(memberAvatarWrapper);

    memberLayout.append(memberAvatar);
    memberLayout.append(memberContent);

    member.append(memberLayout);
    if(user.presence.status === 'offline') member.style.opacity = '50%';

    memberDiv.append(member);
}

function delMembers(){
    document.getElementById('memberDiv').innerHTML = '';
}

function timestampToObject(timestamp){
    let date = new Date(timestamp),
        monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
    return {
                year: date.getFullYear(),
                month: date.getMonth()+1,
                monthWord: monthNames[date.getMonth()],
                day: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds(),
                milisecond: date.getMilliseconds()
            };
}

function createChat(){
    document.getElementById('chatContent').style = 'overflow-y: hidden;';

    let chatContent = document.getElementById('chatContent'),
        chatWrapper = document.createElement('div');

    chatWrapper.classList.add('chatWrapper');
    chatContent.append(chatWrapper);
}

function updateChat(obj){
    // console.log(obj);

    let chatContent = document.getElementById('chatContent'),
        chatWrapper = document.getElementsByClassName('chatWrapper')[0],
        messageWrapper = document.createElement('div'),
        messageContainer = document.createElement('div'),
        messageTime = document.createElement('span'),
        messageAuthor = document.createElement('span'),
        messageContent = document.createElement('span'),
        messageAttachment = document.createElement('div'),
        messageSeparator = document.createElement('div'),
        messageSeparatorText = document.createElement('div'),
        botTag = document.createElement('span');

    if(!chatWrapper){
        createChat();
        chatWrapper = document.getElementsByClassName('chatWrapper')[0];
    }

    // chatWrapper.classList.add("chatWrapper");
    messageWrapper.classList.add('messageWrapper');
    messageContainer.classList.add('messageContainer');
    messageTime.classList.add('messageTime');
    messageAuthor.classList.add('messageAuthor');
    messageContent.classList.add('messageContent');
    messageAttachment.classList.add('messageAttachment');
    messageSeparator.classList.add('messageSeparator');
    messageSeparatorText.classList.add('messageSeparatorText');
    botTag.classList.add('botTag');

    obj.forEach(data =>{
        if(document.getElementById(`msg/${data.message.id}`))
            return;
        let wrapper = messageWrapper.cloneNode(),
            container = messageContainer.cloneNode(),
            time = messageTime.cloneNode(),
            author = messageAuthor.cloneNode(),
            content = messageContent.cloneNode(),
            attachment = messageAttachment.cloneNode(),
            bot = botTag.cloneNode(),
            
            separator = messageSeparator.cloneNode(),
            separatorText = messageSeparatorText.cloneNode()
            separatorDiv = document.getElementById(`date/${data.date.day}/${data.date.month}/${data.date.year}`);

        // console.log(`date/${data.date.day}/${data.date.month}/${data.date.year}`, separatorDiv, !separatorDiv)
        if(!separatorDiv){
            separatorText.innerText = `${data.date.day} ${data.date.monthWord} ${data.date.year}`;
            separator.append(separatorText);
            separator.id = `date/${data.date.day}/${data.date.month}/${data.date.year}`;
            chatWrapper.append(separator);
        }

        wrapper.id = `msg/${data.message.id}`;
        bot.innerText = 'bot';

        time.innerText = `${data.date.hour < 10 ? '0' : ''}${data.date.hour}:${data.date.minute < 10 ? '0' : ''}${data.date.minute}`;
        author.innerText = `${data.message.member.nickname !== null ? data.message.member.nickname : data.message.author.username}`;
        if(data.message.member.colorRole) author.style.color = data.message.member.colorRole.hexColor;
        content.innerText = `${data.message.content}`;
        // attachment.innerText = `${data.date.hour}:${data.date.minute}`;

        // document.getElementById('chatContent').innerText += `${data.date.hour}:${data.date.minute} ${data.message.member.nickname !== null ? data.message.member.nickname : data.message.author.username} ${data.message.content}\n`;

        container.append(time);
        if(data.message.author.bot) container.append(bot);
        container.append(author);
        container.append(content);
        // container.append(attachment);
        // wrapper.append(time);
        wrapper.append(container);
        chatWrapper.append(wrapper);
    });

    // chatContent.append(chatWrapper);
    // document.getElementById('chatContent').innerText += obj;

    chatContent.getElementsByClassName('chatWrapper')[0].scrollTop = chatContent.getElementsByClassName('chatWrapper')[0].scrollHeight;

}