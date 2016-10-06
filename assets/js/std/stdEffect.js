var standardEffect = {
    particles:{
        small:{
            type:"particles",
            particleNum:8,
            fadeStartTime:15,
            fadeEndTime:90,
            startSpeed:0.7,
            endSpeed:1.5
        },
        medium: {
            type:"particles",
            particleNum:12,
            fadeStartTime:25,
            fadeEndTime:150,
            startSpeed:0.9,
            endSpeed:2.5,
            friction:0.08
        },
        large: {
            type:"particles",
            particleNum:25,
            fadeStartTime:25,
            fadeEndTime:170,
            startSpeed:1.5,
            endSpeed:4,
            friction:0.1,
            minSpeed:0.15,
            startSize:0.2,
            endSize:2,
            blur:6
        },
        super_small:{
            type:"particles",
            particleNum:1,
            fadeStartTime:15,
            fadeEndTime:90,
            startSpeed:0.6,
            endSpeed:1.2
        },
    },
    ring:{
        small_out:{
            type:"ring",
            lineWidth:3,
            startRadius:0,
            endRadius:10,
            time:60,
            color:"rgba(255,255,255,",
            blur:4,
            fade:true,
            fadeLine:true,
        },
        medium_out:{
            type:"ring",
            lineWidth:4,
            startRadius:0,
            endRadius:20,
            time:80,
            color:"rgba(255,255,255,",
            blur:5,
            fade:true,
            fadeLine:true,
        },
        large_out:{
            type:"ring",
            lineWidth:6,
            startRadius:0,
            endRadius:40,
            time:90,
            color:"rgba(255,255,255,",
            blur:6,
            fade:true,
            fadeLine:true,
        },
        small_in:{
            type:"ring",
            lineWidth:3,
            startRadius:10,
            endRadius:0,
            time:60,
            color:"rgba(255,255,255,",
            blur:4,
            fade:true,
            fadeLine:true,
        },
        medium_in:{
            type:"ring",
            lineWidth:4,
            startRadius:20,
            endRadius:0,
            time:80,
            color:"rgba(255,255,255,",
            blur:5,
            fade:true,
            fadeLine:true,
        },
        large_in:{
            type:"ring",
            lineWidth:6,
            startRadius:40,
            endRadius:0,
            time:90,
            color:"rgba(255,255,255,",
            blur:6,
            fade:true,
            fadeLine:true,
        }
    },
    show:{
        level_up:{
            type:"show",
            text:"level up!",
            fontSize:10,
            time:120,
            speed:0.2,
            color:"rgba(255,255,100,"
        }
    }
}