/************************************
 * app.js
 * Contains all the random logic,
 * data, and slot machine animation.
 ************************************/

/**
 * 1. Food data & probability
 *    (Originally in the Node.js backend,
 *     now moved to the front end)
 */
const foodList = [
    // Normal diet: Common
    { name: '宫保鸡丁', rarity: '普通', category: '正常饮食' },
    { name: '麻婆豆腐', rarity: '普通', category: '正常饮食' },
    { name: '青椒肉丝', rarity: '普通', category: '正常饮食' },
    { name: '鱼香肉丝', rarity: '普通', category: '正常饮食' },
    { name: '回锅肉', rarity: '普通', category: '正常饮食' },
    { name: '炸酱面', rarity: '普通', category: '正常饮食' },
    // Normal diet: Rare
    { name: '水煮鱼', rarity: '稀有', category: '正常饮食' },
    { name: '辣子虾', rarity: '稀有', category: '正常饮食' },
    { name: '红烧排骨', rarity: '稀有', category: '正常饮食' },
    { name: '干锅牛蛙', rarity: '稀有', category: '正常饮食' },
    // Normal diet: Epic
    { name: '龙井虾仁', rarity: '史诗', category: '正常饮食' },
    { name: '法式鹅肝', rarity: '史诗', category: '正常饮食' },
    { name: '帝王蟹', rarity: '史诗', category: '正常饮食' },
    // Normal diet: Legendary
    { name: '佛跳墙', rarity: '传说', category: '正常饮食' },
    { name: '神户牛排', rarity: '传说', category: '正常饮食' },
  
    // Reduced-fat diet: Common
    { name: '水煮鸡胸肉', rarity: '普通', category: '减脂饮食' },
    { name: '西兰花炒蛋', rarity: '普通', category: '减脂饮食' },
    { name: '黄瓜拌鸡丝', rarity: '普通', category: '减脂饮食' },
    { name: '青菜豆腐汤', rarity: '普通', category: '减脂饮食' },
    { name: '藜麦饭', rarity: '普通', category: '减脂饮食' },
    { name: '燕麦粥', rarity: '普通', category: '减脂饮食' },
    // Reduced-fat diet: Rare
    { name: '香煎三文鱼', rarity: '稀有', category: '减脂饮食' },
    { name: '金枪鱼沙拉', rarity: '稀有', category: '减脂饮食' },
    { name: '虾仁蔬菜炒蛋白饭', rarity: '稀有', category: '减脂饮食' },
    { name: '低脂牛排卷', rarity: '稀有', category: '减脂饮食' },
    // Reduced-fat diet: Epic
    { name: '牛油果鸡胸卷', rarity: '史诗', category: '减脂饮食' },
    { name: '三文鱼牛油果饭', rarity: '史诗', category: '减脂饮食' },
    { name: '和牛沙拉', rarity: '史诗', category: '减脂饮食' },
    // Reduced-fat diet: Legendary
    { name: '低温慢煮牛排', rarity: '传说', category: '减脂饮食' },
    { name: '顶级刺身拼盘', rarity: '传说', category: '减脂饮食' },
  ];
  
  // Probability of each rarity (sum = 100)
  const rarityProbability = {
    '普通': 60,
    '稀有': 25,
    '史诗': 10,
    '传说': 5
  };
  
  /**
   * 2. Random logic
   */
  function getRandomRarity() {
    const rand = Math.random() * 100; // 0 ~ 100
    let sum = 0;
    for (let r in rarityProbability) {
      sum += rarityProbability[r];
      if (rand <= sum) return r;
    }
    return '普通'; // fallback
  }
  
  function getRandomFoodByRarityAndCategory(rarity, category) {
    let filtered = foodList.filter(f => f.rarity === rarity);
    if (category) {
      filtered = filtered.filter(f => f.category === category);
    }
    if (!filtered.length) return null;
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  }
  
  function getRandomFood(category) {
    const rarity = getRandomRarity();
    return getRandomFoodByRarityAndCategory(rarity, category);
  }
  
  /**
   * 3. UI Interactions
   */
  const spinBtn = document.getElementById('spinBtn');
  const slotContent = document.getElementById('slotContent');
  
  /** Read which radio button is selected: "", "正常饮食", or "减脂饮食" */
  function getSelectedCategory() {
    const radios = document.getElementsByName('foodCategory');
    for (let r of radios) {
      if (r.checked) return r.value;
    }
    return ''; // fallback
  }
  
  /** Rarity color mapping */
  function getColorByRarity(rarity) {
    switch (rarity) {
      case '普通': return 'gray';
      case '稀有': return 'blue';
      case '史诗': return 'purple';
      case '传说': return 'red';
      default: return 'black';
    }
  }
  
  /**
   * Generate 4 lines for rolling:
   * - 3 "fake" results
   * - 1 final real result
   */
  function getRollingFoods(category) {
    const lines = [];
    for (let i = 0; i < 3; i++) {
      const f = getRandomFood(category) || { name: '暂无菜品', rarity: '普通', category: '' };
      lines.push(f);
    }
    const finalF = getRandomFood(category) || { name: '暂无结果', rarity: '普通', category: '' };
    lines.push(finalF);
    return lines;
  }
  
  /** Start the slot animation (scrolling) */
  function startSlotAnimation(foods) {
    // Reset transition to ensure multiple spins start from top
    slotContent.style.transition = 'none';
    slotContent.style.top = '0px';
    slotContent.offsetHeight; // Force reflow
    slotContent.style.transition = 'top 1s ease-out';
  
    // Build the HTML
    let html = '';
    foods.forEach((food, index) => {
      const color = getColorByRarity(food.rarity);
      const isFinal = (index === foods.length - 1);
      if (isFinal) {
        // Final line in bold
        html += `<div style="color:${color}; font-weight:bold;">
          ${food.name} - ${food.rarity} (${food.category})
        </div>`;
      } else {
        html += `<div style="color:${color};">
          ${food.name} - ${food.rarity} (${food.category})
        </div>`;
      }
    });
    slotContent.innerHTML = html;
  
    // Scroll distance => (foods.length - 1) * 50
    const totalScroll = (foods.length - 1) * 50;
    setTimeout(() => {
      slotContent.style.top = `-${totalScroll}px`;
    }, 50);
  }
  
  /** On button click => get rolling foods => animate */
  spinBtn.addEventListener('click', () => {
    const category = getSelectedCategory();
    const rollingFoods = getRollingFoods(category);
    startSlotAnimation(rollingFoods);
  });