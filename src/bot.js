const Discord = require('discord.js');
const client = new Discord.Client();

const Store = require('electron-store');
const store = new Store();

module.exports = {
    client: client
};

var ping = 0;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    setInterval(() => {
        if(ping != client.ping){
            document.getElementById('pingSpan').innerText = `Ping: ${Math.round(client.ping)}`;
            ping = client.ping;
        }
    }, 5000);

    setClientUser(client.user);

    delGuilds();

    client.guilds.tap(guild => {
        addGuild(guild);
        // console.log(guild.name);
        document.getElementById('gd/' + guild.id).addEventListener('click', selectGuild);
    });

    try {
        if(store.has('lastGuild'))
            document.getElementById(store.get('lastGuild')).click();
    } catch (error) {
        // console.log(error);
        if(document.getElementsByClassName('listItem')[2]) document.getElementsByClassName('listItem')[2].click();
    }  

    try {      
        if(store.has('lastChannel'))
            document.getElementById(store.get('lastChannel')).click();
    } catch (error) {
        // console.log(error);
        if(document.getElementsByClassName('sidebarChannelContainer')[0]) document.getElementsByClassName('sidebarChannelContainer')[0].click();
    }
    
    goToApp();
});

client.on('message', msg => {
//   if (msg.content === 'ping') {
//     msg.reply('pong');
//   }
    // console.log(msg.content);

    let channelId = msg.channel.id,
        channel = document.getElementById(`chc/${channelId}`);

    if(channel) channel.click();
});

client.on("error", (e) => {
    console.error(e);
});

function selectGuild(e){
    let guildId = e.target;
    if(guildId.classList.contains('guildImage'))
        guildId = guildId.parentNode;
    if(guildId.classList.contains('wrapper'))
        guildId = guildId.parentNode;
    if(guildId.classList.contains('listItem'))
        guildId = guildId.id;

    let guild = client.guilds.get(guildId.substring(3));

    delChannels();
    document.getElementsByClassName('sidebarGuildName')[0].innerText = guild.name;
    document.getElementsByClassName('sidebarGuildName')[0].id = `gdo/${guild.id}`;
    document.getElementsByClassName('sidebarGuildName')[0].setAttribute('guild', guild.id);
    document.getElementsByClassName('sidebarContainer1')[0].addEventListener('click', getGuildOptions);


    // https://stackoverflow.com/questions/57023811/how-to-map-by-sorting-by-a-certain-property

    const descPos = (a, b) => {
        if (a.type !== b.type) {
            if (a.type === 'voice') return 1;
            else return -1;
        } else return a.position - b.position;
    };

    const channels = new Discord.Collection();

    channels.set('__none', guild.channels.filter(channel => !channel.parent && channel.type !== 'category').sort(descPos));

    const categories = guild.channels.filter(channel => channel.type === 'category').sort(descPos);
    categories.forEach(category => channels.set(category.id, category.children.sort(descPos)));

    for (let [categoryID, children] of channels) {
        const category = guild.channels.get(categoryID);
        if (category) addChannel(category);
        for (let [, child] of children){
            addChannel(child, selectChannel, selectChannelForChat);
            if(child.type == 'voice' && child.members.size > 0){
                for(let [, member] of child.members){
                    // console.log(member)
                    addVoiceUser(child, member);
                    if(member.selfMute || member.serverMute)
                        setMute(member, true);
                    if(guild.afkChannelID === member.voiceChannelID)
                        setMute(member, true);
                    if(member.selfDeaf || member.serverDeaf)
                        setDeaf(member, true);
                    // setMute(member, member.mute);
                    // setDeaf(member, member.deaf);
                }
            }
        }
    }

    // console.log(list.join('\n'));

    guild.channels.tap(channel =>{ 
        if(channel.type === 'category')
            document.getElementById('ch/' + channel.id).addEventListener('click', selectChannel);
    })

    loadMembers(guild);

    store.set('lastGuild', guildId);

    // guild.fetchAuditLogs()
    //     .then(audit => console.log(audit))
    //     .catch(console.error);
    //414537106145280002 molj inbvite
    //316907844236476416 anton 

    // guild.members.get('281478128629579776').removeRole('414537106145280002');
    // guild.members.get('281478128629579776').removeRole('316907844236476416');
}

function getGuildOptions(e){
    let target = e.target;
    while(!target.classList.contains('sidebarGuildName')){
        target = target.children[0];
    }


    let gdId = target.getAttribute('guild'),
        guild = client.guilds.get(gdId);
    // console.log(guild);

    let types = [   'string',
                    'number',
                    'boolean',
                    'bigint',
                    // 'undefined',
                    'object',
    ];
    let whitelist = [   
                        {name : 'name', method : "setName"},
                        {name : 'id', method : ""},
                        {name : 'afkChannelID', method : ""},
                        {name : 'memberCount', method : ""},
                        {name : 'createdAt', method : ""},
                        {name : 'joinedAt', method : ""},
    ];

    whitelist.has = function(string){
        // for(data of this){
        for(var i = 0 ; i < this.length; i++){
            // console.log(data);
            if(this[i].name === string){
                // console.log(data.name, '=', string);
                return true;
            } 
        }
        return false;
    };

    function saveOption(e){
        if(e.target.innerText === 'Copy')
            return;
        let target = e.target,
            parent = target.parentNode,
            gdId = parent.getAttribute('channel'),
            method = parent.getAttribute('method'),
            value =parent.children[1].value,
            originalValue = parent.getAttribute('originalValue');
            
        parent.children[1].classList.remove('error');
        clearTaskBar();

        // console.log(target, opBtn, parent, gdId, mbId, method, value, originalValue);
            
        if(value == originalValue)
            return;

        client.guilds.get(gdId)[method](value).catch(function(e){
            parent.children[1].classList.add('error');
            error(e.message.replace(/\n/g, ", "));
            console.error(e.message);
        }).then(function(e){
            log(`Set ${parent.children[0].innerText} of ${gdId} from ${originalValue} to ${value}`);
            document.getElementById(`gd/${gdId}`).click();
            document.getElementById(`gdo/${gdId}`).click();
            // setTimeout(()=>{
            //     document.getElementById(`gd/${gdId}`).click();
            //     document.getElementById(`mb/${mbId}`).click();
            // }, 100);
        });
    }

    clearChat();
    document.getElementsByClassName('chatTitleName')[0].innerText = guild.name;
    let options = [];

    for(data of whitelist){
        // console.log(data);
        if(typeof(guild[data.name]) == 'undefined')
            continue;
            let opt = { type: 'input', channel: guild, data: data.name, method: data.method };
            if(data.method !== '') opt.callback = saveOption;
            options.push(opt);
            // addChatOpDeprecated(channel, data.name, data.method);
    }

    options.push({type: 'separator'});
    // addChatOpDeprecated({'__SEPARATOR': '__SEPARATOR'}, '__SEPARATOR');

    for(data in guild){
        if( types.includes( typeof(guild[data]) ) ){
            if(!whitelist.has(data))
                options.push({ type: 'input', channel: guild, data: data, method: '' });
            // addChatOpDeprecated(channel, data);
        }
    }

    addChatOp(options);
    store.set('lastChannel', `gdo/${guild.id}`);
}

function loadMembers(guild){
    
    // const roleFilter = (a, b) =>{
    //     return b.highestRole.position - a.highestRole.position;

    //     // if(a.hoistRole === null || b.hoistRole === null)
    //     //     return b.highestRole.position - a.highestRole.position;
    //     // return b.hoistRole.position - a.hoistRole.position;
    // };

    delMembers();
    // guild.members.sort(roleFilter).tap(member =>{
    //     addMemeber(member);
    //     document.getElementById(`mb/${member.id}`).addEventListener('click', selectMember);
    // })

    guild.roles.sort((a, b) => b.calculatedPosition - a.calculatedPosition).tap(role =>{
        if(role.hoist || role.name == '@everyone'){
            // console.log(role.name, role.position, role.calculatedPosition, role.members.size);
            role.members.filter(member => member.presence.status !== 'offline').tap(member =>{
                // console.log(member.displayName);
                if(!document.getElementById(`mb/${member.id}`)){
                    addMemeber(member);
                    document.getElementById(`mb/${member.id}`).addEventListener('click', selectMember);
                }
            })
        } 
    })

    guild.members.filter(member => member.presence.status === 'offline').tap(member =>{
        addMemeber(member);
        document.getElementById(`mb/${member.id}`).addEventListener('click', selectMember);
    })
    
    // guild.members.filter(member => member.hoistRole == null).sort(roleFilter).tap(member =>{
    //     addMemeber(member);
    //     document.getElementById(`mb/${member.id}`).addEventListener('click', selectMember);
    // })
}

function selectChannelForChat(e){
    let channelId = e.target;

    if(!channelId.classList.contains('sidebarChannelNameOption'))
        while(channelId.parentNode){
            if( channelId.classList.contains('sidebarChannelContainer') )
                break;
            channelId = channelId.parentNode;
        }

    channelId = channelId.id

    // console.log(channelId);

    if(channelId[2] === 'c'){

        let channel = client.channels.get(channelId.substring(4));

        clearChat();
        document.getElementsByClassName('chatTitleName')[0].innerText = channel.name;
        // console.log(`open chat ${channel.guild.name} ${channel.name}/${channel.id}`);
        channel.fetchMessages()//{ limit: 50 }
            .then(messages => {

                function sorting(a,b){
                    return a.id - b.id;
                }

                // console.log(`Received ${messages.size} messages`)
                // console.log(messages.sort(sorting));

                // let messagesText = "";
                let obj = [];

                messages.sort(sorting).tap(message =>{
                    var time = timestampToObject(message.createdTimestamp);
                    obj.push({date: time, message: message});
                    // messagesText += `${time.hour}:${time.minute} ${message.member.nickname !== null ? message.member.nickname : message.author.username} ${message.content}\n`;
                });

                // console.log(messagesText);
                // document.getElementById('chatContent').innerText = messagesText;

                createChat(obj);
            })
            .catch(console.error);

        store.set('lastChannel', channelId); //word-break: break-all;
    }
}


function selectChannel(e){
    // console.log(e.target);
    let channelId = e.target;
    let types = [   'string',
                    'number',
                    'boolean',
                    'bigint',
                    // 'undefined',
                    'object',
    ];
    let whitelist = [   {name : 'guild', method : ""},
                        {name : 'name', method : "setName"},
                        {name : 'id', method : ""},
                        {name : 'type', method : ""},
                        {name : 'topic', method : "setTopic"},
                        {name : 'bitrate', method : "setBitrate"},
                        {name : 'joinable', method : ""},
                        {name : 'userLimit', method : "setUserLimit"},
                        {name : 'full', method : ""},
                        {name : 'createdAt', method : ""},
                        {name : 'nsfw', method : "setNSFW"},
                        {name : 'rateLimitPerUser', method : "setRateLimitPerUser"},
                        {name : 'position', method : ""},
                        {name : 'calculatedPosition', method : ""},
                        {name : 'typing', method : ""},
                        {name : 'typingCount', method : ""},
    ];

    whitelist.has = function(string){
        // for(data of this){
        for(var i = 0 ; i < this.length; i++){
            // console.log(data);
            if(this[i].name === string){
                // console.log(data.name, '=', string);
                return true;
            } 
        }
        return false;
    };

    while(channelId.parentNode){
        if( channelId.classList.contains('voiceUser') ){
            selectVoiceMember(channelId.id.substring(1));
            return;
        }
        if( channelId.classList.contains('sidebarChannelNameOption') || channelId.classList.contains('sidebarChannelContainer') || channelId.classList.contains('sidebarCategoryContainer') )
            break;
        channelId = channelId.parentNode;
    }
    if(channelId)
        channelId = channelId.id;
    // console.log(channelId);

    if(channelId[2] === 'c')
        return;

    let channel = client.channels.get(channelId.substring(3));
    // let guildCh = client.channels.get(channelId.substring(3)).guild.channels.get(channelId.substring(3));

    // console.log(channel);
    clearChat();
    document.getElementsByClassName('chatTitleName')[0].innerText = channel.name;

    function saveOption(e){
        if(e.target.innerText !== 'Save')
            return;
        let target = e.target,
            parent = target.parentNode,
            chId = parent.getAttribute('channel'),
            method = parent.getAttribute('method'),
            value = parent.children[1].value,
            originalValue = parent.getAttribute('originalValue');
        
        parent.children[1].classList.remove('error');
        clearTaskBar();

        // console.log(chId, method, value);

        if(value == originalValue)
            return;

        client.channels.get(chId)[method](value).catch(function(e){
            parent.children[1].classList.add('error');
            error(e.message.replace(/\n/g, ", "));
            console.error(e.message);
        }).then(function(e){
            log(`Set ${parent.children[0].innerText} of ${chId} from ${originalValue} to ${value}`);
            document.getElementById(`gd/${client.channels.get(chId).guild.id}`).click();
            document.getElementById(`ch/${chId}`).click();
        });
    }

    let options = [];

    // options.push({type: 'separator'});
    // addChatOpDeprecated({'__SEPARATOR': '__SEPARATOR'}, '__SEPARATOR');

    for(data of whitelist){
        // console.log(data);
        if(typeof(channel[data.name]) == 'undefined')
            continue;
            let opt = { type: 'input', channel: channel, data: data.name, method: data.method };
            if(data.method !== '') opt.callback = saveOption;
            options.push(opt);
            // addChatOpDeprecated(channel, data.name, data.method);
    }

    options.push({type: 'separator'});
    // addChatOpDeprecated({'__SEPARATOR': '__SEPARATOR'}, '__SEPARATOR');

    for(data in channel){
        if( types.includes( typeof(channel[data]) ) ){
            if(!whitelist.has(data))
                options.push({ type: 'input', channel: channel, data: data, method: '' });
            // addChatOpDeprecated(channel, data);
        }
    }

    addChatOp(options);

    // let buttons = document.getElementsByClassName('channelOptionButton');

    // for(var i=0; i < buttons.length; i++){
    //     buttons[i].addEventListener('click', saveOption);
    // }

    // for(data in channel){
    //     // if( types.includes( typeof(channel[data]) )){
    //         console.log(data, '(', typeof(channel[data]) , ')', ': ',  channel[data]);
    //         // addChatOp(channel, data);
    //     // }
    // }

    
    store.set('lastChannel', channelId);
}

function selectVoiceMember(id){
    document.getElementById(id).click();
}

client.on('voiceStateUpdate', (oldM, newM) => {
    // console.log(oldM, newM);
    if(newM.voiceChannelID == null){
        delVoiceUser(newM);
    }else{
        addVoiceUser(newM.voiceChannel, newM);
    }

    
    if(newM.selfMute || newM.serverMute)
        setMute(newM, true);
    if(newM.guild.afkChannelID === newM.voiceChannelID)
        setMute(newM, true);
    if(newM.selfDeaf || newM.serverDeaf)
        setDeaf(newM, true);

    // var video = newM.guild._rawVoiceStates.get(newM.id);
    // var video = newM;
    // console.log(video);

    // if(video)
    //     setGoLive(newM, true);

});

function selectMember(e){
    // console.log(e.target);
    let memberDiv = e.target;
    let types = [   'string',
                    'number',
                    'boolean',
                    'bigint',
                    // 'undefined',
                    'object',
    ];
    let whitelist = [   {name : 'guild', method : ""},
                        {name : 'nickname', method : "setNickname"},
                        {name : 'displayName', method : ""},
                        {name : 'id', method : ""},
                        {name : 'serverDeaf', method : "setDeaf"},
                        {name : 'serverMute', method : "setMute"},
                        {name : 'voiceChannelID', method : "setVoiceChannel"},
    ];

    whitelist.has = function(string){
        for(var i = 0 ; i < this.length; i++){
            if(this[i].name === string){
                return true;
            } 
        }
        return false;
    };

    while(memberDiv.parentNode){
        if( memberDiv.classList.contains('member') ) break;
        memberDiv = memberDiv.parentNode;
    }
    // if(memberDiv) memberDiv = memberDiv.id;
    let member = client.guilds.get(memberDiv.getAttribute('guild')).members.get(memberDiv.id.substring(3));
    
    // console.log(member);

    clearChat();
    document.getElementsByClassName('chatTitleName')[0].innerText = member.nickname != null ? member.nickname : member.user.username;

    function saveOption(e){
        if(e.target.innerText === 'Copy')
            return;
        let target = e.target,
            opBtn = target.hasAttribute("opBtn"),
            parent = opBtn ? target : target.parentNode,
            gdId = parent.getAttribute('guild'),
            mbId = parent.getAttribute('channel'),
            method = parent.getAttribute('method'),
            value = opBtn ? parent.getAttribute('originalValue') : parent.children[1].value,
            originalValue = parent.getAttribute('originalValue');
            
        if(opBtn){
            value = (value == 'true');
            value = !value;
        }
        if(!opBtn) parent.children[1].classList.remove('error');
        clearTaskBar();

        // console.log(target, opBtn, parent, gdId, mbId, method, value, originalValue);
            
        if(value == originalValue)
            return;

        client.guilds.get(gdId).members.get(mbId)[method](value).catch(function(e){
            if(!opBtn) parent.children[1].classList.add('error');
            error(e.message.replace(/\n/g, ", "));
            console.error(e.message);
        }).then(function(e){
            if(opBtn){
                log(`${parent.innerText}${parent.innerText=='Mute'||parent.innerText=='Unute'?'d':''}${parent.innerText=='Deaf'||parent.innerText=='Undeaf'?'ened':''}${parent.innerText=='Disconnect'?'ed':''} ${mbId}`);
            }else
                log(`Set ${parent.children[0].innerText} of ${mbId} from ${originalValue} to ${value}`);
                document.getElementById(`gd/${gdId}`).click();
                document.getElementById(`mb/${mbId}`).click();
                // setTimeout(()=>{
                //     document.getElementById(`gd/${gdId}`).click();
                //     document.getElementById(`mb/${mbId}`).click();
                // }, 100);
        });
    }

    function sendToVoid(e){
        let target = e.target,
            gdId = target.getAttribute('guild'),
            mbId = target.getAttribute('channel');

        client.guilds.get(gdId).members.get(mbId).setVoiceChannel(target.innerText==='Disconnect'?null:client.guilds.get(gdId).afkChannelID);
    }

    let options = [];

    if(member.voiceChannelID){
        let afkString = `Send to ${member.guild.afkChannel ? member.guild.afkChannel.name : 'afk'} channel`;
        if(member.guild.afkChannel)
            afkString = `Send to ${member.guild.afkChannel.name} channel`;
        else
            afkString = `There is no afk channel ¯\\_(ツ)_/¯`;

        let opt = { type: 'btngroup', member: member,
                    btns:[  { type: 'toggle', name: 'Mute', method:'setMute', state: member.serverMute, callback: saveOption },
                            { type: 'toggle', name: 'Deaf', method:'setDeaf', state: member.serverDeaf, callback: saveOption },
                            { type: 'btn', name: afkString, method:'', disabled: (!member.guild.afkChannel ? true : undefined), callback: sendToVoid }, 
                            { type: 'btn', name: `Disconnect`, method:'', callback: sendToVoid }]};

        options.push(opt);

        options.push({type: 'separator'});
    }

    for(data of whitelist){
        // console.log(data);
        if(typeof(member[data.name]) == 'undefined')
            continue;
            let opt = { type: 'input', channel: member, data: data.name, method: data.method };
            if(data.method !== '') opt.callback = saveOption;
            options.push(opt);
            // addChatOpDeprecated(member, data.name, data.method);
    }

    options.push({type: 'separator'});
    // addChatOpDeprecated({'__SEPARATOR': '__SEPARATOR'}, '__SEPARATOR');

    for(data in member){
        if( types.includes( typeof(member[data]) ) ){
            if(!whitelist.has(data))
                options.push({ type: 'input', channel: member, data: data });
            // addChatOpDeprecated(member, data);
        }
    }


    addChatOp(options);

    // let buttons = document.getElementsByClassName('channelOptionButton');

    // for(var i=0; i < buttons.length; i++){
    //     buttons[i].addEventListener('click', function(e){
            
    //     });
    // }

    store.set('lastChannel', memberDiv.id);
}

client.on('presenceUpdate', (oldM, newM) =>{
    if(newM.presence.status != oldM.presence.status && newM.guild.id === store.get('lastGuild').substring(3)){
        // console.log(oldM.displayName, oldM.presence.status, '=>', newM.presence.status)
        loadMembers(newM.guild);
    }
})