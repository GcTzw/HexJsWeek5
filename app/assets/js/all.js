const colorPrimary = "#00807E";

const objFieldNameArr = [
  {
    id: "txtName",
    name: "套票名稱",
    objFieldName: "name"
  },
  {
    id: "txtImgUrl",
    name: "圖片網址",
    objFieldName:"imgUrl"
  },
  {
    id: "slcArea",
    name: "景點地區",
    objFieldName:"area"
  },
  {
    id: "txtPrice",
    name: "套票金額",
    objFieldName:"price"
  },
  {
    id: "txtGroup",
    name: "套票組數",
    objFieldName:"group"
  },
  {
    id: "txtRate",
    name: "套票星級",
    objFieldName:"rate"
  },
  {
    id: "txtDesc",
    name: "套票描述",
    objFieldName:"description"
  }
];

// let data = [
//   {
//     "id": 0,
//     "name": "肥宅心碎賞櫻3日",
//     "imgUrl": "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80",
//     "area": "高雄",
//     "description": "賞櫻花最佳去處。肥宅不得不去的超讚景點！",
//     "group": 87,
//     "price": 1400,
//     "rate": 10
//   },
//   {
//     "id": 1,
//     "name": "貓空纜車雙程票",
//     "imgUrl": "https://images.unsplash.com/photo-1501393152198-34b240415948?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
//     "area": "台北",
//     "description": "乘坐以透明強化玻璃為地板的「貓纜之眼」水晶車廂，享受騰雲駕霧遨遊天際之感",
//     "group": 99,
//     "price": 240,
//     "rate": 2
//   },
//   {
//     "id": 2,
//     "name": "台中谷關溫泉會1日",
//     "imgUrl": "https://images.unsplash.com/photo-1535530992830-e25d07cfa780?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
//     "area": "台中",
//     "description": "全館客房均提供谷關無色無味之優質碳酸原湯，並取用八仙山之山冷泉供蒞臨貴賓沐浴及飲水使用。",
//     "group": 20,
//     "price": 1765,
//     "rate": 7
//   }
// ];

let data=[];

init();

function init()
{
  axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
  .then(function (response) {
    console.log(response);
    data = response.data.data;
    renderData("");
    renderC3();
  });

}

function renderData(area)
{
  let tripArea = document.querySelector('.trip-area');
  tripArea.innerHTML = "";

  let cnt = 0;
  data.forEach(function(item){
    if(area=="")
    {
      tripArea.innerHTML+=getOneSet(item);
      cnt++;
    }else if (area == item.area) {
      tripArea.innerHTML+=getOneSet(item);
      cnt++;
    }      
  });

  let searchResult = document.querySelector('#searchResult');
  searchResult.innerText = cnt;

  if(area == "")
    document.querySelector('#slcSearch').value = "所有";
  
}

function renderC3()
{

  // 篩選地區，並累加數字上去
  // totalObj 會變成 {高雄: 2, 台北: 1, 台中: 2}
  let totalObj = {};
  data.forEach(function(item,index){
    if(totalObj[item.area]==undefined){
      totalObj[item.area] = 1;
    }else{
      totalObj[item.area] +=1;
    }
  })


  // newData = [["高雄", 2], ["台北",1], ["台中", 1]]
  let newData = [];
  let area = Object.keys(totalObj);
  // area output ["高雄","台北","台中"]
  area.forEach(function(item,index){
    let ary = [];
    ary.push(item);
    ary.push(totalObj[item]);
    newData.push(ary);
  })

  // 將 newData 丟入 c3 產生器
  const chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: newData,
      type : 'donut',
    },
    donut: {
      title: "地區"
    }
  });

}



function onchange_slcSearch()
{
  let slcSearch = document.querySelector('#slcSearch');
  renderData(slcSearch.value == "所有" ? "" : slcSearch.value);  
}

function AddOneSet()
{
  let newDataObj = {};
  let PassFlag = true;

  objFieldNameArr.forEach(function(item){
    if(PassFlag)
    {
      let input = document.querySelector(`#${item.id}`);
      if(!input.value)
      {
        Swal.fire({
          title: '資料不完整！',
          text:  `${item.name}沒有填寫！`,
          icon: 'error',
          confirmButtonColor: colorPrimary
        })      
        PassFlag = false;
      }

      if(PassFlag)
        switch(item.id)
        {
          case "txtPrice":
          case "txtGroup":
          case "txtRate":
            if(isNaN(parseFloat(input.value)))
            {
              Swal.fire({
                title: '資料有誤！',
                text:  `${item.name}只能填數字`,
                icon: 'error',
                confirmButtonColor: colorPrimary
              })      
              PassFlag = false;
            }
            break;
          case "txtDesc":
            if(input.value.length>100)
            {
              Swal.fire({
                title: '資料有誤！',
                text:  `${item.name}填寫長度請勿超過100`,
                icon: 'error',
                confirmButtonColor: colorPrimary
              })      
              PassFlag = false;
            }
            break;
          default:
            break;
        }

      newDataObj[item.objFieldName] = input.value;
    } 
  });

  if(PassFlag){
    newDataObj.id = data.length;
    data.push(newDataObj);

    Swal.fire({
      title: '新增成功！',
      text: "",
      icon: 'success',
      confirmButtonColor: colorPrimary
    })

    renderData("");
    renderC3();
    clearAddPanel();
  } 
}

function clearAddPanel()
{
  objFieldNameArr.forEach(function(item){
    
      let input = document.querySelector(`#${item.id}`);
      input.value = "";
    
  });
}

function getOneSet(obj)
{
  let rtnStr = "";
  rtnStr += '<li class="trip-item shadow">';

  rtnStr += getImgArea(obj);
  rtnStr += getInfoArea(obj);

  rtnStr += '</li>';
  return rtnStr;
}

function getImgArea(obj)
{
  let rtnStr = "";
  rtnStr += '<div class="trip-item-img-area">';
  rtnStr += `<img src="${obj.imgUrl}" alt="">`;
  rtnStr += `<div class="trip-item-location">${obj.area}</div>`;
  rtnStr += `<div class="trip-item-rate">${obj.rate}</div>`;
  rtnStr += '</div>';
  return rtnStr;
}

function getInfoArea(obj)
{
  let rtnStr = "";
  rtnStr += '<div class="trip-item-info-area">';

  rtnStr += '<div>';
  rtnStr += `<h4>${obj.name}</h4>`;
  rtnStr += `<p>${obj.description}</p>`;
  rtnStr += '</div>';

  rtnStr += getInfoAreaFooter(obj);

  rtnStr += '</div>';
  return rtnStr;
}

function getInfoAreaFooter(obj)
{
  let rtnStr = "";
  rtnStr += '<div class="d-flex justify-content-between">';
  rtnStr += getInfoAreaRemain(obj);
  rtnStr += getInfoAreaPrice(obj);
  rtnStr += '</div>';
  return rtnStr;
}

function getInfoAreaRemain(obj)
{
  let rtnStr = "";
  rtnStr += '<div class="d-flex align-items-center">';
  rtnStr += '<span class="material-symbols-outlined me-1">error</span>';
  rtnStr += `剩下最後 ${obj.group} 組`;
  rtnStr += '</div>';
  return rtnStr;
}

function getInfoAreaPrice(obj)
{
  let rtnStr = "";
  rtnStr += '<div class="d-flex align-items-center">';
  rtnStr += '<span class="fs-6 me-1">TWD</span>';
  rtnStr += `<span class="fs-2">$${toCurrency(obj.price)}</span>`;
  rtnStr += '</div>';
  return rtnStr;
}

function toCurrency(num){
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}