/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('products').del()
  await knex('products').insert([
    {
      product_id: 1,
      name: 'Cheeseburger',
      description: 'Burger với phô mai, thịt bò, rau và sốt đặc biệt.',
      category_id: 1,
      price: 144000,
      status: true,
      sold: 120,
      avg_rating: 4.5,
      product_url: 'https://i.postimg.cc/XqNrP4Cb/temp-Imagep0-OZtx.avif'
    },
    {
      product_id: 2,
      name: 'Chicken Burger',
      description: 'Burger với thịt gà chiên giòn và rau tươi.',
      category_id: 1,
      price: 156000,
      status: true,
      sold: 95,
      avg_rating: 4.3,
      product_url: 'https://i.postimg.cc/tJ2GrHh8/temp-Image1o5-Ben.avif'
    },
    {
      product_id: 3,
      name: 'Double Beef Burger',
      description: 'Burger với hai lớp thịt bò và phô mai tan chảy.',
      category_id: 1,
      price: 192000,
      status: true,
      sold: 80,
      avg_rating: 4.7,
      product_url: 'https://i.postimg.cc/q78XVBzh/temp-Image-YRZMJL.avif'
    },
    // Pizza
    {
      product_id: 4,
      name: 'Pepperoni Pizza',
      description: 'Pizza truyền thống với sốt cà chua, phô mai và pepperoni.',
      category_id: 2,
      price: 216000,
      status: true,
      sold: 150,
      avg_rating: 4.6,
      product_url: 'https://i.postimg.cc/PqGzRvrn/temp-Image-Dlaugb.avif'
    },
    {
      product_id: 5,
      name: 'Margherita Pizza',
      description: 'Pizza với sốt cà chua, phô mai mozzarella và húng quế.',
      category_id: 2,
      price: 192000,
      status: true,
      sold: 85,
      avg_rating: 4.2,
      product_url: 'https://i.postimg.cc/50b5xcCP/temp-Image-Mzum-R1.avif'
    },
    {
      product_id: 6,
      name: 'Hawaiian Pizza',
      description: 'Pizza với dứa, giăm bông và phô mai mozzarella.',
      category_id: 2,
      price: 228000,
      status: true,
      sold: 60,
      avg_rating: 4.1,
      product_url: 'https://i.postimg.cc/d1FMw06z/temp-Image4y-Jngp.avif'
    },
    // Gà rán
    {
      product_id: 7,
      name: 'Fried Chicken (2 Pieces)',
      description: '2 miếng gà rán giòn với lớp bột vàng rộm.',
      category_id: 3,
      price: 120000,
      status: true,
      sold: 200,
      avg_rating: 4.7,
      product_url: 'https://i.postimg.cc/yNzpSbRR/temp-Image-QQw-BLs.avif'
    },
    {
      product_id: 8,
      name: 'Chicken Nuggets (10 Pieces)',
      description: '10 miếng gà nugget chiên giòn, chấm với sốt.',
      category_id: 3,
      price: 132000,
      status: true,
      sold: 175,
      avg_rating: 4.4,
      product_url: 'https://i.postimg.cc/T3vJkWPM/temp-Image9-AXVi-N.avif'
    },
    {
      product_id: 9,
      name: 'Spicy Wings (6 Pieces)',
      description: 'Cánh gà cay với lớp gia vị đặc biệt.',
      category_id: 3,
      price: 168000,
      status: true,
      sold: 90,
      avg_rating: 4.6,
      product_url: 'https://i.postimg.cc/rst5j8Xw/temp-Imageg-PPAgk.avif'
    },
    // Đồ ăn nhẹ
    {
      product_id: 10,
      name: 'French Fries',
      description: 'Khoai tây chiên giòn, thêm chút muối và gia vị.',
      category_id: 4,
      price: 72000,
      status: true,
      sold: 300,
      avg_rating: 4.5,
      product_url: 'https://i.postimg.cc/tTh8vV0s/temp-Imagebymkjc.avif'
    },
    {
      product_id: 11,
      name: 'Onion Rings',
      description: 'Hành tây chiên giòn, ăn kèm với sốt.',
      category_id: 4,
      price: 84000,
      status: true,
      sold: 120,
      avg_rating: 4.3,
      product_url: 'https://i.postimg.cc/52mKLmSk/temp-Image-LG9i-LS.avif'
    },
    {
      product_id: 12,
      name: 'Mozzarella Sticks',
      description: 'Phô mai que chiên giòn tan chảy.',
      category_id: 4,
      price: 120000,
      status: true,
      sold: 75,
      avg_rating: 4.8,
      product_url: 'https://i.postimg.cc/Hn5Bx0Lz/temp-Image-RQxj2f.avif'
    },
    // Đồ uống
    {
      product_id: 13,
      name: 'Coca-Cola',
      description: 'Nước ngọt có ga, giải khát.',
      category_id: 5,
      price: 36000,
      status: true,
      sold: 500,
      avg_rating: 4.8,
      product_url: 'https://i.postimg.cc/65rMxhg5/temp-Imagei-G1jv-L.avif'
    },
    {
      product_id: 14,
      name: 'Milkshake (Chocolate)',
      description: 'Milkshake vị socola béo ngậy, thêm kem tươi.',
      category_id: 5,
      price: 96000,
      status: true,
      sold: 90,
      avg_rating: 4.6,
      product_url: 'https://i.postimg.cc/j2V4GWh7/temp-Imagekron-VZ.avif'
    },
    {
      product_id: 15,
      name: 'Iced Lemon Tea',
      description: 'Trà chanh mát lạnh, giải nhiệt mùa hè.',
      category_id: 5,
      price: 60000,
      status: true,
      sold: 180,
      avg_rating: 4.5,
      product_url: 'https://i.postimg.cc/9QPK12Cb/temp-Imagel39au-D.avif'
    }
  ]);
};
