var Polygon_Coordinates=[];//array for storing points

const canvas = document.getElementById('canvas');//initialising 
const Canvas_Context = canvas.getContext('2d');  //the canvas
var n;//number of points
var diameter=3;

//Event Listener for adding points on canvas on click
//and adding them to Polygon_Coordinates array
canvas.addEventListener("click",function(event){	
	var x,y;
    let rect = canvas.getBoundingClientRect();
	x=event.x-rect.left;
	y=event.y-rect.top;
    var Coordinates={"x":x,"y":y};
    Polygon_Coordinates.push(Coordinates);
    var max = Polygon_Coordinates.length - 1;
	//checking for initial case and if not drawing the line joining points
    if (typeof Polygon_Coordinates[max - 1] !== "undefined") { 
        var Current_Coordinate = Polygon_Coordinates[max]      
		var Previous_Coordinate = Polygon_Coordinates[max - 1];
        Canvas_Context.beginPath();
        Canvas_Context.moveTo(Previous_Coordinate.x, Previous_Coordinate.y);
        Canvas_Context.lineTo(Current_Coordinate.x, Current_Coordinate.y);
		Canvas_Context.lineWidth=3;
		Canvas_Context.strokeStyle ="#353232"
		Canvas_Context.stroke();
    }
	n=Polygon_Coordinates.length;
	Draw_Point(x,y,"#2D4C89");//drawing circle on the point clicked
})

//Function to draw a circle on the given point on Canvas
function Draw_Point(x,y,Colour) {
	Canvas_Context.arc(x-1,y-1,diameter,0,Math.PI*2,true);
	Canvas_Context.beginPath();
	Canvas_Context.arc(x-1,y-1,diameter,0,Math.PI*2,true);
	Canvas_Context.closePath();
	Canvas_Context.fillStyle = Colour;
	Canvas_Context.fill(); 	   
	Canvas_Context.closePath();
}
var delay_time=1000;//Variable to change 
var d_t=500;       //the speed animation

var tdel=1000,tdt=500;


const rang=document.getElementById("myRange");
rang.addEventListener("change",function(){
	var spd=rang.value;
	delay_time=1000-20*(spd-50);
	d_t=500-10*(spd-50);
	tdel=delay_time;
	tdt=d_t;
	console.log(spd);
})

//function to join points to form a new polygon after clipping an ear 
function draw_line(i){
	var Current_Coordinate = Polygon_Coordinates[ans[i][0]]; 
	var Previous_Coordinate = Polygon_Coordinates[ans[i][1]];
	Canvas_Context.beginPath();
	Canvas_Context.moveTo(Previous_Coordinate.x, Previous_Coordinate.y);
	Canvas_Context.lineTo(Current_Coordinate.x, Current_Coordinate.y);
	Canvas_Context.strokeStyle = '#ff0000';
	Canvas_Context.lineWidth=0.5;
	Canvas_Context.stroke();
}

//function to change color of clipped point
function Change_Color(x1,y1,x2,y2,x3,y3){
	window.setTimeout(function(){
	Draw_Point(x1,y1,"lawngreen");
	Draw_Point(x2,y2,"#2D4C89");
	Draw_Point(x3,y3,"#2D4C89");
	},d_t)
}
//function to update color of points which are being clipped
function Update_Color(x1,y1,x2,y2,x3,y3,count){
	window.setTimeout(function(){
	Draw_Point(x1,y1,"yellow");
	Draw_Point(x2,y2,"yellow");
	Draw_Point(x3,y3,"yellow");
	draw_line(count);
	Change_Color(x1,y1,x2,y2,x3,y3)
	},delay_time);
	delay_time+=2*tdel;
}

//Node for polygon each representing a coordinate
class node {
    constructor(x,y,index) {
      this.x = x;
	  this.y=y;
	  this.index=index;//order of the node with x and y coordinates is also stored
      this.prev = null;
      this.next = null;
    }
}

//Node for list to store indexes of Ears
class nodel {
    constructor(indexl) {
      this.indexl = indexl;
      this.nextl = null;
    }
}

//Class for Updating Elements on Ear object
class points{
	constructor(){			  //initialising the object
		this.length=0;
		this.headl = null;
	}
	Add_Item(val){			  //Class function for adding properties in object
		var newnodel = new nodel(val);
		if(this.headl==null)  //if the object is empty
		{
			newnodel.nextl=null;
			this.headl=newnodel;
			this.length++;
			return;
		}
		var t=this.headl;
		while(t.nextl!=null) //if it is not then transversing to the last
	 	{					 // element and adding new newnodel
			t=t.nextl;
		}
		t.nextl=newnodel;
		newnodel.nextl=null;
		this.length++;
	}
	Delete_Item(t)//member function to delete a node passed from the object
	{
		var te=this.headl;
		if(te==t)	//if the the node to delete is head
		{
			this.headl=te.nextl;
			this.length--;
			return;
		}
		var pre=new node;
		while(te!=t)//otherwise transversing to the previous and deleting the node
		{
			pre=te;
			te=te.nextl;
		}
		this.length--;
		pre.nextl=te.nextl;
	}
	display()//Member function to display the Ear Object
	{
		var t=this.headl;
		while(t!=null){
			console.log(t.indexl+" ");
			t=t.nextl;
		}
	}
};
//defining the Object Ear globally to store and update Ears of polygon
Ear=new points;

var trgl=new Object();//object for storing coordinates of triangle
function Form_trgl(temp){
	trgl={};
	trgl.x1=(temp.prev).x;
	trgl.y1=(temp.prev).y;
	trgl.x2=temp.x;
	trgl.y2=temp.y;
	trgl.x3=(temp.next).x;
	trgl.y3=(temp.next).y;
}

//Function for finding whether a coordinate forms 
//reflex angle wrt the other two coordintes beside it
function Chck_Rflx(temp){

	var dtpr=(trgl.x1-trgl.x2)*(trgl.x3-trgl.x2)+(trgl.y1-trgl.y2)*(trgl.y3-trgl.y2);
	//finding dot product of vectors 

	var det=(trgl.x1-trgl.x2)*(trgl.y3-trgl.y2)-(trgl.y1-trgl.y2)*(trgl.x3-trgl.x2);
	//finding determinant wrt the x and y components of vector

	var angl=Math.atan2(det,dtpr);
	if(angl<0)// if atan2<0 then reflex angle so the point is not an ear
		return 0;
	else
		return 1;
}

//function for finding area formed by three triangle with their coordinates
function area(c)
{
	if(c==0)
   		return Math.abs((trgl.x1*(trgl.y2-trgl.y3) + trgl.x2*(trgl.y3-trgl.y1)+ trgl.x3*(trgl.y1-trgl.y2))/2.0);
	else if(c==1)
		return Math.abs((trgl.x4*(trgl.y2-trgl.y3) + trgl.x2*(trgl.y3-trgl.y4)+ trgl.x3*(trgl.y4-trgl.y2))/2.0);
	else if(c==2)
		return Math.abs((trgl.x1*(trgl.y4-trgl.y3) + trgl.x4*(trgl.y3-trgl.y1)+ trgl.x3*(trgl.y1-trgl.y4))/2.0);
	else
		return Math.abs((trgl.x1*(trgl.y2-trgl.y4) + trgl.x2*(trgl.y4-trgl.y1)+ trgl.x4*(trgl.y1-trgl.y2))/2.0);
}

//function for checking that if we form a triangle by three points does 
//any other point of polygon come inside it
function Chck_Trgl(temp)
{
	var A = area (0);//finding area of orignal triangle
    var t=(temp.next).next;
	//checking every other point of the polygon if atleast one such point exists
	//then the triangle cannot be clipped
    while(temp.prev!=t){
		trgl.x4=t.x;
		trgl.y4=t.y;
    	if((trgl.x4 != trgl.x1 || trgl.y4 != trgl.y1) && (trgl.x4 != trgl.x2 || trgl.y4!=trgl.y2) && (trgl.x4 != trgl.x3 || trgl.y4 != trgl.y3))
  		{
  			var A1=area(1);	//finding area of the triangles formed by the other coordinate and other 2 from 3   
  			var A2=area(2);//and checking if the sum is equal to area of orignal triangle which
  			var A3=area(3);//is only true if point lies in or on the orignal triangle
  			if(A==(A1+A2+A3))
  				return false;//if atleast one inside point is found return false
		}
		t=t.next;
	}
	return true;
}
//array for storing indexes of points which are to be joined for triangulation
let ans=[];

//Defining class for storing the coordinates of polygon
class graph{			
	constructor(){
		this.length=0;//using a double sided list
		this.head=null;
		this.tail=null;
	}

	//member function to display the object
	display()
	{
		var t=this.head;
		console.log("{")
		while(1)
		{
			console.log('{'+t.x+","+t.y+'}');
			t=t.next; 
			if(t==this.head||t==null)
			break;
		}
		console.log("}")
	}

	//member function to delete a given node from the object
	Delete_Point(t)
	{									
		var p=t.prev;
		var n=t.next;
		p.next=n;
		n.prev=p;
		if(t==this.head)//checking if the node to delete is head and updating head accordingly
			this.head=n;
		this.length--;
	}

	//member function to add an point to object
	Add_Point(a,b,i){
		var newnode = new node(a,b,i);
		var t=this.head;
		if(this.head==null)//if the object is empty 
		{
			newnode.next=null;
			newnode.prev=null;
			this.head=newnode;
			this.tail=newnode;
			this.length++;
			return;
		}
		while(t.next!=null)//otherwise transversing to the last element and adding node
		{
			t=t.next;	
		}
		t.next=newnode;
		newnode.prev=t;
		if(this.length==n-1){
			newnode.next=this.head;
			this.head.prev=newnode;
		}
		else
		newnode.next=null;
		this.tail=newnode;
		this.length++;
		this.display();
		if(this.length==n){//if the polygon is drawn finding Ear and start Clipping
			this.Find_Ears();
			Ear.display();
			this.Ear_Clip();
		}
	}
	Find_Ears(){
		a=new points;
		Ear=a; //initialising Ear to null
		var temp=this.head;
		var count=0;//maintaining index by count variable
		while(1)//looping till we reach the initial node
		{
			Form_trgl(temp);
			var a=Chck_Rflx(temp);//checking if the coordinate form reflex angle
			console.log("a:"+a);
			if(a===1)
			{
				console.log("b:"+b);
				var b=Chck_Trgl(temp);//checking if any other point comes inside the triangle formed
				if(b==1)
				{
					console.log("count:"+count);
					Ear.Add_Item(count);//adding the index to Ear list 
				}
			}
			temp=temp.next;
			count++;
			if(temp==this.head)
				break;
		}
	}
	//member function for transversing through the Ears and deleting
	// coordinates and indexes from ear until only a triangle is left
	Ear_Clip()
	{
		var temp=this.head;
		var t=Ear.headl;
		var count=0;//for maintaining count of number of coordinates removed
		var m=this.length-3;
		while(count<m)//looping till n-3 coordinates are removed and only a triangle is left
		{

			if(temp.index==t.indexl)//finding the point whose index is element of ear
			{
				var p=temp.prev;
				var n=temp.next;

				//function to update color of points which are being clipped
			 	Update_Color(temp.x,temp.y,p.x,p.y,n.x,n.y,count);

				ans[count][0]=(temp.prev).index;//storing the index of prev and next coordinate
				ans[count][1]=(temp.next).index;//in the ans array
				//deleting the coordinate and index from graph and ear respectively				
				this.Delete_Point(temp);
				this.display();
				Ear.Delete_Item(t);

				Ear.display();
				Form_trgl(p);

				if(Chck_Rflx(p)&&Chck_Trgl(p))//checking if the removal of a coordinate made a new Ear at previous node
				{
					var ch=Ear.headl;
					var c=1;
					while(ch!=null)
					{
						if(ch.indexl==p.index)//checking if the previous node index is already present in Ear list
						{
							c=0;
							break;
						}
						ch=ch.nextl;
					}
					if(c==1){
						Ear.Add_Item(p.index);//updating ear list
						Ear.display();
					}
				}
				else{
					var ch=Ear.headl;
					while(ch!=null)
					{
						if(ch.indexl==p.index)//checking if the previous node index is already present in Ear list
						{
							Ear.Delete_Item(ch)
							break;
						}
						ch=ch.nextl;
					}
				}

				Form_trgl(n);
				if(Chck_Rflx(n)&&Chck_Trgl(n))//checking if the removal of a coordinate made a new Ear at next node
				{
					var ch=Ear.headl;
					var c=1;
					while(ch!=null)
					{
						if(ch.indexl==n.index)//checking if the next node index is already present in Ear list
						{
							c=0;
							break;
						}
						ch=ch.nextl;
					}
					if(c==1){
						console.log("added");
						Ear.Add_Item(n.index);//updating ear list
						Ear.display();
					}
				}
				else{
					var ch=Ear.headl;
					while(ch!=null)
					{
						if(ch.indexl==n.index)//checking if the next node index is already present in Ear list
						{
							Ear.Delete_Item(ch);
							break;
						}
						ch=ch.nextl;
					}
				}
				t=Ear.headl;//after removing element again starting from the first node of Ear list
				temp=n.next;//making the checker equal to next node address
				count++;
			}
			else
			{
				temp=temp.next;
				continue;
			}
			t=Ear.headl;
		}
	}
};

//function for starting the ear clipping algorithm
function start(){
	polygon=new graph;
	for(var i=0;i<n-3;i++)
	ans[i]=[];
	for(var i=0;i<Polygon_Coordinates.length;i++){
		polygon.Add_Point(Polygon_Coordinates[i].x,Polygon_Coordinates[i].y,i);
	}
}

//Event listener on triangulate button to start the algorithm
$("button").on("click",function(){
	const Canvas_Context = canvas.getContext('2d');
	Canvas_Context.beginPath();
	Canvas_Context.moveTo(Polygon_Coordinates[Polygon_Coordinates.length-1].x,Polygon_Coordinates[Polygon_Coordinates.length-1].y);
	Canvas_Context.lineTo(Polygon_Coordinates[0].x,Polygon_Coordinates[0].y);
	Canvas_Context.lineWidth=3.0;
    Canvas_Context.stroke();
    start();
})
