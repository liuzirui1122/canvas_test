var Tadpole = function() {
	var tadpole = this;
    
    this.AI = null;
    
	//初始位置随机 300*300矩形内
	this.x = Math.random() * 300 - 150;
	this.y = Math.random() * 300 - 150;
    this.z = 100; //频道
    
    //圆的半径
	this.size = 6;
    
    //默认主炮塔绘制参数
    this.headSize = 2;
    this.headAngle = Math.PI * 0.14;
    this.headDistance = 1.5;
	
	this.name = '';
	this.age = 0;
	//this.sex = -1;
	//this.icon = '/images/default.png'; //头像
	this.img = {};
	
    //是否有鼠标经过
	this.hover = false;
    
    //主机武器朝向
	this.angle = Math.PI * 2;
    
    //武器
    this.weapon = [];
    this.weapon[1] = null;
    this.weapon[2] = null;
    this.weapon[3] = null;
    this.weapon[4] = null;
    
    this.weaponSlot = 2;
    
    //主机转体速度 (>1) 
    this.turningSpeed = 5;
    
	this.speed = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.speedAngle = 0;
    this.frictionAngle = 0;
    this.speedMax = 2.5;
    
    this.friction = 0.05;
    this.standardAcc = 0.25;
	
    this.keyNavX = 0;
    this.keyNavY = 0;
    
    //是否纯键盘控制
    this.noMouse = 0;
    
    //消息
	this.messages = [];
    
    //不活动时间
	//this.timeSinceLastActivity = 0;
	
    //是否改变
	this.changed = 0;
    
    //无服务器加载时间
	this.timeSinceLastServerUpdate = 0;
    
    this.fire = function(model) {
        for (var i=1;i<tadpole.weaponSlot+1;i++) {
            if (tadpole.weapon[i]!=null) tadpole.weapon[i].fire(model);
        }
    };
    
    this.cease = function() {
        for (var i=1;i<tadpole.weaponSlot+1;i++) {
            if (tadpole.weapon[i]!=null) tadpole.weapon[i].cease();
        }
    };
    
	this.update = function(mouse,model) {
		tadpole.timeSinceLastServerUpdate++;
        
        tadpole.age++;
        
        if(tadpole.AI != null) {
            var condition = {};
            tadpole.AI.update(condition,model);
        }
        
        var currFriction = tadpole.friction;
        
        //更新位置
        tadpole.x += tadpole.speedX;
        tadpole.y += tadpole.speedY;
        
        //获取全局速度及方向
        tadpole.speed = Math.sqrt(tadpole.speedX*tadpole.speedX+tadpole.speedY*tadpole.speedY);
        
        if(tadpole.speed>0) {
            currFriction = tadpole.friction;
            tadpole.frictionAngle = Math.atan2(tadpole.speedY,tadpole.speedX);
        } else currFriction = 0;
        
        if(tadpole.speed < tadpole.speedMax) {
            if(tadpole.keyNavX !=0 || tadpole.keyNavY !=0) {
                tadpole.speedAngle = Math.atan2(tadpole.keyNavY,tadpole.keyNavX);
            } else {
                tadpole.speedAngle = -100;
            }
            
            if(tadpole.speedAngle != -100) {
                tadpole.speedX += tadpole.standardAcc*Math.cos(tadpole.speedAngle);
                tadpole.speedY += tadpole.standardAcc*Math.sin(tadpole.speedAngle);
            }
        }
        
        if (tadpole.speedX * (tadpole.speedX - tadpole.friction*Math.cos(tadpole.frictionAngle)) <= 0) tadpole.speedX = 0;
        else tadpole.speedX -= currFriction*Math.cos(tadpole.frictionAngle);
        if (tadpole.speedY * (tadpole.speedY - tadpole.friction*Math.sin(tadpole.frictionAngle)) <= 0) tadpole.speedY = 0;
        else tadpole.speedY -= tadpole.friction*Math.sin(tadpole.frictionAngle);
        
        //更新消息队列
        //负向更新才能splice!!!
		for (var i = tadpole.messages.length - 1; i >= 0; i--) {
			var msg = tadpole.messages[i];
			msg.update();
			
			if(msg.age == msg.maxAge) {
				tadpole.messages.splice(i,1);
			}
		}

		// 如果鼠标悬浮在主机上，就把hover为true，同时更新mouse.tadpole
		if(Math.sqrt(Math.pow(tadpole.x - mouse.worldx,2) + Math.pow(tadpole.y - mouse.worldy,2)) < tadpole.size+2) {
			tadpole.hover = true;
			mouse.tadpole = tadpole;
		}
		else {
            //否则置hover为false
			tadpole.hover = false;
		}
        
        //更新尾巴
		//tadpole.tail.update();
        
        //更新武器
        for (var i=1;i<tadpole.weaponSlot+1;i++) {
            if (tadpole.weapon[i]!=null) tadpole.weapon[i].update(tadpole,model);
        }
	};
	
    //如果认证了,点击出twitter地址
    
	this.onclick = function(e) {
        /*
		if(e.ctrlKey && e.which == 1) {
			if(isAuthorized() && tadpole.hover) {
				window.open("http://twitter.com/" + tadpole.name.substring(1));
                return true;
			}
		}
		else if(e.which == 2) {
			//todo:open menu
			e.preventDefault();
            return true;
		}
        */
        return false;
	};
	
    
    //更新
	this.userUpdate = function(tadpoles, angleTargetX, angleTargetY) {
		
		
        var prevState = {
			angle: tadpole.angle,
		}
		// 定义anglediff(下一次要转的度数) 
        // Angle to targetx and targety (mouse position)
		var anglediff = ((Math.atan2(angleTargetY - tadpole.y, angleTargetX - tadpole.x)) - tadpole.angle);
        
        //将要转的度数投影到-2pi到2pi之间
		while(anglediff < -Math.PI) {
			anglediff += Math.PI * 2;
		}
		while(anglediff > Math.PI) {
			anglediff -= Math.PI * 2;
		}
		
        //平滑转体
		tadpole.angle += anglediff / tadpole.turningSpeed;
		
		
        //changed加上改变角度的3倍加上主机的动量
        //这里以转向来判断主机是否还在更新
		tadpole.changed += Math.abs((prevState.angle - tadpole.angle)*3) + tadpole.speed;
		
        
        //如果主机更新了
		if(tadpole.changed > 1) {
			this.timeSinceLastServerUpdate = 0;
		}
        
	};
	
    
	this.draw = function(context) {
        //不透明度 
        //本opacity方程式是 timeSinceLastServerUpdate 从300到+inf 时 opa从1平滑过渡到0.2的方程式
		var opacity = Math.max(Math.min(20 / Math.max(tadpole.timeSinceLastServerUpdate-300,1),1),.2).toFixed(3);
        
        /* 
        //显示头像
		if(tadpole.hover) {
			drawIcon(context);
		}
		
        //根据性别设定颜色
		if(tadpole.sex == 0){
			context.fillStyle = 'rgba(255, 181, 197,'+opacity+')';
		}else if(tadpole.sex == 1){
			context.fillStyle = 'rgba(192, 253, 247,'+opacity+')';
		}
		else{
			context.fillStyle = 'rgba(226,219,226,'+opacity+')';
		}
		
        */
        
        context.fillStyle = 'rgba(226,219,226,'+opacity+')';
        
        //投影(发光),6大小的模糊,颜色白色70%透明
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur    = 6;
		context.shadowColor   = 'rgba(255, 255, 255, '+opacity*0.7+')';
		
		//画圆
		context.beginPath();
        context.arc(tadpole.x, tadpole.y, tadpole.size, 0, Math.PI * 2, true); 
		//context.arc(tadpole.x, tadpole.y, tadpole.size, tadpole.angle + Math.PI * 2.7, tadpole.angle + Math.PI * 1.3, true); 
		
        
        //画尾巴
		//tadpole.tail.draw(context);
		
		context.closePath();
		context.fill();
		
        //画三角头
        context.beginPath();
        
        context.moveTo(tadpole.x+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.cos(tadpole.angle),tadpole.y+(tadpole.size+tadpole.headDistance+tadpole.headSize)*Math.sin(tadpole.angle));
		context.lineTo(tadpole.x+(tadpole.size+tadpole.headDistance)*Math.cos(tadpole.angle-tadpole.headAngle),tadpole.y+(tadpole.size+tadpole.headDistance)*Math.sin(tadpole.angle-tadpole.headAngle));
        context.lineTo(tadpole.x+(tadpole.size+tadpole.headDistance)*Math.cos(tadpole.angle+tadpole.headAngle),tadpole.y+(tadpole.size+tadpole.headDistance)*Math.sin(tadpole.angle+tadpole.headAngle));
        
        context.closePath();
        context.fill();
        
        //画尾巴
		//tadpole.tail.draw(context);
		
        //画武器
        for (var i=1;i<tadpole.weaponSlot+1;i++) {
            if (tadpole.weapon[i]!=null) tadpole.weapon[i].draw(context);
        }
        
		context.shadowBlur = 0;
		context.shadowColor   = '';
		
		drawName(context);
		drawMessages(context);
	};
    
	//判断名字是否为twitter账号
	var isAuthorized = function() {
		return tadpole.name.charAt('0') == "@";
	};
	
    //画名字
	var drawName = function(context) {
        
		var opacity = Math.max(Math.min(20 / Math.max(tadpole.timeSinceLastServerUpdate-300,1),1),.2).toFixed(3);
		context.fillStyle = 'rgba(226,219,226,'+opacity+')';
		context.font = 7 + "px 'proxima-nova-1','proxima-nova-2', arial, sans-serif";
		context.textBaseline = 'hanging';
		var width = context.measureText(tadpole.name).width;
		context.fillText(tadpole.name, tadpole.x - width/2, tadpole.y + 8);
	}
	
	var drawMessages = function(context) {
		tadpole.messages.reverse();
		for(var i = 0, len = tadpole.messages.length; i<len; i++) {
			tadpole.messages[i].draw(context, tadpole.x+10, tadpole.y+5, i);
		}
		tadpole.messages.reverse();
	};
	

    /*
    //画头像
	var drawIcon = function(context){
		if('undefined' == typeof tadpole.img || 'undefined' == typeof tadpole.img.src || tadpole.img.src != tadpole.icon){
		    var img= new Image();
		    img.src=tadpole.icon;
		    img.onerror = function(){img.src='/images/default.png';}
		    tadpole.img = img;
		}
		
		if(tadpole.img.complete){
		    var w = tadpole.img.width;
		    var h = tadpole.img.height;
		    var w =w/h >= 1 ? 30 : (30*w)/h;
		    var h = h/w >=1 ? 30 : (30*h)/w;
		    var x = tadpole.x-15; 
		    var y = tadpole.y-38;
		    context.drawImage(tadpole.img, x, y, w, h);
		    context.fillStyle="rgba(0,0,0,0)";  
		    context.strokeStyle="#fff"; 
		    context.linewidth=10; 
		    context.fillRect(x,y,w,h);
		    context.strokeRect(x,y,w,h); 
		    context.closePath();
		}
	};
	

    // 尾巴
	(function() {
		tadpole.tail = new TadpoleTail(tadpole);
	})();
    */
}