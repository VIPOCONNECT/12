/**
 * VIPO Shipping Calculator
 * Main JavaScript File
 */

// אובייקט לאחסון מידות המכולות לפי סוג
const containerDimensions = {
  "33.2": { name: "20ft", length: 590, width: 235, height: 239, cbm: 33.2 },
  "67": { name: "40ft HQ", length: 1203, width: 235, height: 269, cbm: 67 },
  "76": { name: "45ft HQ", length: 1350, width: 235, height: 269, cbm: 76 }
};

/**
 * חישוב כמות היחידות שיכולות להיכנס למכולה
 */
function calculateCapacityFromDimensions() {
  // קבלת המידות מהטופס
  const containerType = document.getElementById('containerType').value;
  const boxLength = parseInt(document.getElementById('length').value);
  const boxWidth = parseInt(document.getElementById('width').value);
  const boxHeight = parseInt(document.getElementById('height').value);

  // וידוא שהערכים תקינים
  if (!boxLength || !boxWidth || !boxHeight) {
    showResult('capacityResult', 'נא להזין מידות תקינות לקרטון');
    return;
  }

  // המרת מידות מסנטימטרים לסנטימטרים מעוקבים
  const boxVolumeCM = boxLength * boxWidth * boxHeight;
  const boxVolumeCBM = boxVolumeCM / 1000000; // המרה לקוב

  // קבלת המידות של המכולה
  const container = containerDimensions[containerType];
  const containerVolume = container.cbm;

  // חישוב כמות מקסימלית תיאורטית (לפי נפח)
  const maxTheoretical = Math.floor(containerVolume / boxVolumeCBM);

  // חישוב של סידור אופטימלי (כמה יחידות בכל מימד)
  const lengthFit = Math.floor(container.length / boxLength);
  const widthFit = Math.floor(container.width / boxWidth);
  const heightFit = Math.floor(container.height / boxHeight);
  
  // חישוב כמה יחידות יכנסו בסידור אופטימלי
  const arrangement1 = lengthFit * widthFit * heightFit;
  
  // בדיקת סידור אלטרנטיבי (סיבוב הקופסה)
  const lengthFit2 = Math.floor(container.length / boxWidth);
  const widthFit2 = Math.floor(container.width / boxLength);
  const arrangement2 = lengthFit2 * widthFit2 * heightFit;
  
  // בדיקת סידור אלטרנטיבי שלישי
  const lengthFit3 = Math.floor(container.length / boxLength);
  const widthFit3 = Math.floor(container.width / boxHeight);
  const heightFit3 = Math.floor(container.height / boxWidth);
  const arrangement3 = lengthFit3 * widthFit3 * heightFit3;
  
  // בחירת הסידור הטוב ביותר
  const bestArrangement = Math.max(arrangement1, arrangement2, arrangement3);
  
  // פקטור ניצולת מציאותי (75%)
  const realistic = Math.floor(bestArrangement * 0.75);
  
  // הכנת טקסט התוצאה בהתאם לשפה
  const lang = document.body.className || 'he';
  let result = '';
  
  if (lang === 'he') {
    result = `
      <p><strong>נפח קרטון:</strong> ${boxVolumeCBM.toFixed(3)} CBM</p>
      <p><strong>נפח מכולה ${container.name}:</strong> ${container.cbm} CBM</p>
      <p><strong>כמות מקסימלית (תיאורטית):</strong> ${maxTheoretical} יחידות</p>
      <p><strong>סידור אופטימלי:</strong> ${bestArrangement} יחידות</p>
      <p><strong>כמות מציאותית (כולל פקטור 75%):</strong> ${realistic} יחידות</p>
    `;
  } else if (lang === 'en') {
    result = `
      <p><strong>Box volume:</strong> ${boxVolumeCBM.toFixed(3)} CBM</p>
      <p><strong>Container ${container.name} volume:</strong> ${container.cbm} CBM</p>
      <p><strong>Maximum theoretical capacity:</strong> ${maxTheoretical} units</p>
      <p><strong>Optimal arrangement:</strong> ${bestArrangement} units</p>
      <p><strong>Realistic capacity (with 75% factor):</strong> ${realistic} units</p>
    `;
  } else if (lang === 'zh') {
    result = `
      <p><strong>箱子体积:</strong> ${boxVolumeCBM.toFixed(3)} CBM</p>
      <p><strong>集装箱 ${container.name} 体积:</strong> ${container.cbm} CBM</p>
      <p><strong>最大理论容量:</strong> ${maxTheoretical} 单位</p>
      <p><strong>最佳排列:</strong> ${bestArrangement} 单位</p>
      <p><strong>实际容量 (75% 因素):</strong> ${realistic} 单位</p>
    `;
  }

  // הצגת התוצאה
  showResult('capacityResult', result);
}

/**
 * חישוב נפח ליחידה בהתבסס על מספר היחידות
 */
function calculateUnitVolumeFromTotal() {
  const containerType = document.getElementById('containerType').value;
  const unitsInContainer = parseInt(document.getElementById('unitsInContainer').value);
  
  if (!unitsInContainer) {
    showResult('reverseCalcResult', 'נא להזין מספר יחידות');
    return;
  }
  
  const containerVolume = containerDimensions[containerType].cbm;
  const actualVolume = containerVolume / unitsInContainer;
  
  const lang = document.body.className || 'he';
  let result = '';
  
  if (lang === 'he') {
    result = `<p>הנפח הממוצע לכל יחידה הוא <strong>${actualVolume.toFixed(3)} CBM</strong></p>`;
  } else if (lang === 'en') {
    result = `<p>The average volume per unit is <strong>${actualVolume.toFixed(3)} CBM</strong></p>`;
  } else if (lang === 'zh') {
    result = `<p>每单位的平均体积为 <strong>${actualVolume.toFixed(3)} CBM</strong></p>`;
  }
  
  showResult('reverseCalcResult', result);
}

/**
 * חישוב עלות סופית ליחידה במכולה
 */
function calculateTotal() {
  // קבלת ערכים מהטופס
  const productCost = parseFloat(document.getElementById('productCost').value);
  const units = parseInt(document.getElementById('units').value);
  const containerCost = parseFloat(document.getElementById('containerCost').value);
  const factoryToPort = parseFloat(document.getElementById('factoryToPort').value);
  const customsClearance = parseFloat(document.getElementById('customsClearance').value);
  const localDelivery = parseFloat(document.getElementById('localDelivery').value);
  const vatRate = parseFloat(document.getElementById('vatRate').value);
  
  if (!productCost || !units || !containerCost || isNaN(factoryToPort) || isNaN(customsClearance) || isNaN(localDelivery) || isNaN(vatRate)) {
    showResult('result', 'נא להזין את כל הנתונים הנדרשים');
    return;
  }
  
  // חישוב העלות ליחידה
  const shippingPerUnit = containerCost / units;
  const factoryToPortPerUnit = factoryToPort / units;
  const clearancePerUnit = customsClearance / units;
  const deliveryPerUnit = localDelivery / units;
  const totalBeforeVat = productCost + shippingPerUnit + factoryToPortPerUnit + clearancePerUnit + deliveryPerUnit;
  const vatAmount = (totalBeforeVat) * (vatRate / 100);
  const total = totalBeforeVat + vatAmount;
  
  const lang = document.body.className || 'he';
  let result = '';
  
  if (lang === 'he') {
    result = `
      <p><strong>עלות מוצר:</strong> $${productCost.toFixed(2)}</p>
      <p><strong>עלות שילוח ליחידה:</strong> $${shippingPerUnit.toFixed(2)}</p>
      <p><strong>שילוח מהמפעל לנמל ליחידה:</strong> $${factoryToPortPerUnit.toFixed(2)}</p>
      <p><strong>עלות שחרור ממכס ליחידה:</strong> $${clearancePerUnit.toFixed(2)}</p>
      <p><strong>עלות שילוח מקומי ליחידה:</strong> $${deliveryPerUnit.toFixed(2)}</p>
      <p><strong>סה"כ לפני מע"מ:</strong> $${totalBeforeVat.toFixed(2)}</p>
      <p><strong>מע"מ (${vatRate}%):</strong> $${vatAmount.toFixed(2)}</p>
      <p class="total-cost"><strong>עלות סופית ליחידה:</strong> $${total.toFixed(2)}</p>
    `;
  } else if (lang === 'en') {
    result = `
      <p><strong>Product cost:</strong> $${productCost.toFixed(2)}</p>
      <p><strong>Shipping cost per unit:</strong> $${shippingPerUnit.toFixed(2)}</p>
      <p><strong>Factory to port per unit:</strong> $${factoryToPortPerUnit.toFixed(2)}</p>
      <p><strong>Customs clearance per unit:</strong> $${clearancePerUnit.toFixed(2)}</p>
      <p><strong>Local delivery per unit:</strong> $${deliveryPerUnit.toFixed(2)}</p>
      <p><strong>Total before VAT:</strong> $${totalBeforeVat.toFixed(2)}</p>
      <p><strong>VAT (${vatRate}%):</strong> $${vatAmount.toFixed(2)}</p>
      <p class="total-cost"><strong>Final cost per unit:</strong> $${total.toFixed(2)}</p>
    `;
  } else if (lang === 'zh') {
    result = `
      <p><strong>产品成本:</strong> $${productCost.toFixed(2)}</p>
      <p><strong>每单位运输成本:</strong> $${shippingPerUnit.toFixed(2)}</p>
      <p><strong>每单位工厂到港口:</strong> $${factoryToPortPerUnit.toFixed(2)}</p>
      <p><strong>每单位海关清关:</strong> $${clearancePerUnit.toFixed(2)}</p>
      <p><strong>每单位本地配送:</strong> $${deliveryPerUnit.toFixed(2)}</p>
      <p><strong>增值税前总计:</strong> $${totalBeforeVat.toFixed(2)}</p>
      <p><strong>增值税 (${vatRate}%):</strong> $${vatAmount.toFixed(2)}</p>
      <p class="total-cost"><strong>每单位最终成本:</strong> $${total.toFixed(2)}</p>
    `;
  }
  
  showResult('result', result);
}

/**
 * חישוב עלות לפריט בודד (LCL)
 */
function calculateSingleShipping() {
  // קבלת ערכים מהטופס
  const productCost = parseFloat(document.getElementById('singleProductCost').value);
  const lclRate = parseFloat(document.getElementById('lclRate').value);
  const volume = parseFloat(document.getElementById('singleVolume').value);
  const clearanceCost = parseFloat(document.getElementById('singleClearance').value);
  const deliveryCost = parseFloat(document.getElementById('singleDelivery').value);
  const vatRate = parseFloat(document.getElementById('singleVatRate').value);
  
  if (!productCost || !lclRate || !volume || isNaN(clearanceCost) || isNaN(deliveryCost) || isNaN(vatRate)) {
    showResult('singleShippingResult', 'נא להזין את כל הנתונים הנדרשים');
    return;
  }
  
  // חישוב עלויות
  const shippingCost = lclRate * volume;
  const totalBeforeVat = productCost + shippingCost + clearanceCost + deliveryCost;
  const vatAmount = totalBeforeVat * (vatRate / 100);
  const total = totalBeforeVat + vatAmount;
  
  const lang = document.body.className || 'he';
  let result = '';
  
  if (lang === 'he') {
    result = `
      <p><strong>עלות מוצר:</strong> $${productCost.toFixed(2)}</p>
      <p><strong>עלות שילוח (${volume} CBM * $${lclRate}):</strong> $${shippingCost.toFixed(2)}</p>
      <p><strong>עלות שחרור ממכס:</strong> $${clearanceCost.toFixed(2)}</p>
      <p><strong>עלות הובלה פנימית:</strong> $${deliveryCost.toFixed(2)}</p>
      <p><strong>סה"כ לפני מע"מ:</strong> $${totalBeforeVat.toFixed(2)}</p>
      <p><strong>מע"מ (${vatRate}%):</strong> $${vatAmount.toFixed(2)}</p>
      <p class="total-cost"><strong>עלות סופית לפריט:</strong> $${total.toFixed(2)}</p>
    `;
  } else if (lang === 'en') {
    result = `
      <p><strong>Product cost:</strong> $${productCost.toFixed(2)}</p>
      <p><strong>Shipping cost (${volume} CBM * $${lclRate}):</strong> $${shippingCost.toFixed(2)}</p>
      <p><strong>Customs clearance:</strong> $${clearanceCost.toFixed(2)}</p>
      <p><strong>Domestic delivery:</strong> $${deliveryCost.toFixed(2)}</p>
      <p><strong>Total before VAT:</strong> $${totalBeforeVat.toFixed(2)}</p>
      <p><strong>VAT (${vatRate}%):</strong> $${vatAmount.toFixed(2)}</p>
      <p class="total-cost"><strong>Final cost for item:</strong> $${total.toFixed(2)}</p>
    `;
  } else if (lang === 'zh') {
    result = `
      <p><strong>产品成本:</strong> $${productCost.toFixed(2)}</p>
      <p><strong>运输成本 (${volume} CBM * $${lclRate}):</strong> $${shippingCost.toFixed(2)}</p>
      <p><strong>海关清关:</strong> $${clearanceCost.toFixed(2)}</p>
      <p><strong>国内运输:</strong> $${deliveryCost.toFixed(2)}</p>
      <p><strong>增值税前总计:</strong> $${totalBeforeVat.toFixed(2)}</p>
      <p><strong>增值税 (${vatRate}%):</strong> $${vatAmount.toFixed(2)}</p>
      <p class="total-cost"><strong>物品最终成本:</strong> $${total.toFixed(2)}</p>
    `;
  }
  
  showResult('singleShippingResult', result);
}

/**
 * חישוב סידור אופטימלי של קרטונים במכולה
 */
function calculateOptimalArrangement() {
  // קבלת ערכים מהטופס
  const containerType = document.getElementById('containerType').value;
  const boxLength = parseInt(document.getElementById('length').value);
  const boxWidth = parseInt(document.getElementById('width').value);
  const boxHeight = parseInt(document.getElementById('height').value);
  const utilizationFactor = parseFloat(document.getElementById('utilizationFactor').value);
  
  if (!boxLength || !boxWidth || !boxHeight) {
    showResult('arrangementResult', 'נא להזין מידות תקינות לקרטון');
    return;
  }
  
  // חישוב נפח הקרטון ב-CBM
  const boxVolumeCM = boxLength * boxWidth * boxHeight;
  const boxVolumeCBM = boxVolumeCM / 1000000;
  
  // קבלת נתוני המכולה
  const container = containerDimensions[containerType];
  
  // בדיקת כל האפשרויות של סידור הקרטונים
  const orientations = [
    { l: boxLength, w: boxWidth, h: boxHeight },
    { l: boxLength, w: boxHeight, h: boxWidth },
    { l: boxWidth, w: boxLength, h: boxHeight },
    { l: boxWidth, w: boxHeight, h: boxLength },
    { l: boxHeight, w: boxLength, h: boxWidth },
    { l: boxHeight, w: boxWidth, h: boxLength }
  ];
  
  // חישוב כמה קרטונים יכנסו בכל סידור
  const arrangements = orientations.map(o => {
    const lengthFit = Math.floor(container.length / o.l);
    const widthFit = Math.floor(container.width / o.w);
    const heightFit = Math.floor(container.height / o.h);
    const totalBoxes = lengthFit * widthFit * heightFit;
    
    return {
      orientation: `${o.l} x ${o.w} x ${o.h}`,
      lengthFit,
      widthFit,
      heightFit,
      totalBoxes,
      volumeEfficiency: (totalBoxes * boxVolumeCBM / container.cbm * 100).toFixed(2)
    };
  });
  
  // מיון הסידורים לפי כמות הקרטונים (מהגדול לקטן)
  arrangements.sort((a, b) => b.totalBoxes - a.totalBoxes);
  
  // חישוב כמות מציאותית עם פקטור ניצולת
  const bestArrangement = arrangements[0];
  const realisticBoxes = Math.floor(bestArrangement.totalBoxes * utilizationFactor);
  
  // הכנת טקסט התוצאה בהתאם לשפה
  const lang = document.body.className || 'he';
  let result = '';
  
  if (lang === 'he') {
    result = `
      <p><strong>נפח קרטון:</strong> ${boxVolumeCBM.toFixed(3)} CBM</p>
      <p><strong>נפח מכולה (${container.name}):</strong> ${container.cbm} CBM</p>
      <p><strong>סידור אופטימלי:</strong> ${bestArrangement.orientation} סנטימטר</p>
      <p><strong>מספר קרטונים:</strong> ${bestArrangement.lengthFit} (אורך) x ${bestArrangement.widthFit} (רוחב) x ${bestArrangement.heightFit} (גובה)</p>
      <p><strong>סה"כ קרטונים (תיאורטי):</strong> ${bestArrangement.totalBoxes}</p>
      <p><strong>יעילות נפחית:</strong> ${bestArrangement.volumeEfficiency}%</p>
      <p><strong>כמות מציאותית (פקטור ${utilizationFactor * 100}%):</strong> ${realisticBoxes} קרטונים</p>
    `;
  } else if (lang === 'en') {
    result = `
      <p><strong>Box volume:</strong> ${boxVolumeCBM.toFixed(3)} CBM</p>
      <p><strong>Container volume (${container.name}):</strong> ${container.cbm} CBM</p>
      <p><strong>Optimal orientation:</strong> ${bestArrangement.orientation} cm</p>
      <p><strong>Box count:</strong> ${bestArrangement.lengthFit} (length) x ${bestArrangement.widthFit} (width) x ${bestArrangement.heightFit} (height)</p>
      <p><strong>Total boxes (theoretical):</strong> ${bestArrangement.totalBoxes}</p>
      <p><strong>Volume efficiency:</strong> ${bestArrangement.volumeEfficiency}%</p>
      <p><strong>Realistic count (${utilizationFactor * 100}% factor):</strong> ${realisticBoxes} boxes</p>
    `;
  } else if (lang === 'zh') {
    result = `
      <p><strong>箱子体积:</strong> ${boxVolumeCBM.toFixed(3)} CBM</p>
      <p><strong>集装箱体积 (${container.name}):</strong> ${container.cbm} CBM</p>
      <p><strong>最佳方向:</strong> ${bestArrangement.orientation} 厘米</p>
      <p><strong>箱子数量:</strong> ${bestArrangement.lengthFit} (长度) x ${bestArrangement.widthFit} (宽度) x ${bestArrangement.heightFit} (高度)</p>
      <p><strong>总箱子 (理论):</strong> ${bestArrangement.totalBoxes}</p>
      <p><strong>体积效率:</strong> ${bestArrangement.volumeEfficiency}%</p>
      <p><strong>实际数量 (${utilizationFactor * 100}% 因素):</strong> ${realisticBoxes} 箱子</p>
    `;
  }
  
  showResult('arrangementResult', result);
}

/**
 * פונקציה עזר להצגת תוצאה בתיבת תוצאה
 */
function showResult(elementId, content) {
  const resultElement = document.getElementById(elementId);
  if (resultElement) {
    resultElement.innerHTML = content;
    resultElement.style.display = 'block';
    
    // גלילה אל התוצאה
    resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * מעבר בין שפות
 */
function switchLanguage(lang) {
  const htmlTag = document.getElementById('htmlTag');
  const heBtn = document.getElementById('heBtn');
  const enBtn = document.getElementById('enBtn');
  const zhBtn = document.getElementById('zhBtn');
  
  // איפוס כל הקלאסים של שפה
  document.body.classList.remove('en', 'zh');
  heBtn.classList.remove('active');
  enBtn.classList.remove('active');
  zhBtn.classList.remove('active');
  
  // הגדרת השפה הנבחרת
  if (lang === 'he') {
    htmlTag.lang = 'he';
    heBtn.classList.add('active');
  } else if (lang === 'zh') {
    htmlTag.lang = 'zh';
    document.body.classList.add('zh');
    zhBtn.classList.add('active');
  } else { // en - ברירת מחדל
    htmlTag.lang = 'en';
    document.body.classList.add('en');
    enBtn.classList.add('active');
  }
  
  // עדכון כל האלמנטים עם תכונות שפה
  document.querySelectorAll('[data-he], [data-en], [data-zh]').forEach(element => {
    const text = element.getAttribute(`data-${lang}`);
    if (text) {
      element.textContent = text;
    }
  });
  
  // עדכון אפשרויות בתיבות הבחירה
  document.querySelectorAll('select').forEach(select => {
    Array.from(select.options).forEach(option => {
      const text = option.getAttribute(`data-${lang}`);
      if (text) {
        option.textContent = text;
      }
    });
  });
}

// אתחול האפליקציה כאשר המסמך נטען
document.addEventListener('DOMContentLoaded', function() {
  // זיהוי שפה נוכחית לפי דפדפן המשתמש (אופציונלי)
  const userLang = navigator.language || navigator.userLanguage;
  
  // הגדרת שפת ברירת מחדל לעברית
  // אם רוצים לזהות שפת משתמש, ניתן להוסיף כאן לוגיקה 
  // switchLanguage(userLang.startsWith('he') ? 'he' : userLang.startsWith('zh') ? 'zh' : 'en');
  
  // עדכון הכותרת של החלון
  document.title = 'VIPO - מחשבון שילוח';
});
