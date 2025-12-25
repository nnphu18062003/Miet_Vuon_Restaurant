/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('products').del()
  await knex('products').insert([
    // Khai Vị
    {
      product_id: 1,
      name: 'Bò Lụi Sả',
      description: 'Burger với phô mai, thịt bò, rau và sốt đặc biệt.',
      category_id: 1,
      price: 144000,
      status: true,
      sold: 120,
      avg_rating: 4.5,
      product_url: '/menu/khaivi/boluisa.jpeg'
    },
    {
      product_id: 2,
      name: 'Chả Giò Rế',
      description: 'Burger với thịt gà chiên giòn và rau tươi.',
      category_id: 1,
      price: 156000,
      status: true,
      sold: 95,
      avg_rating: 4.3,
      product_url: '/menu/khaivi/chagiore.jpeg'
    },
    {
      product_id: 3,
      name: 'Chả Ram Tôm Đất',
      description: 'Burger với hai lớp thịt bò và phô mai tan chảy.',
      category_id: 1,
      price: 192000,
      status: true,
      sold: 80,
      avg_rating: 4.7,
      product_url: '/menu/khaivi/charamtomdat.jpeg'
    },
    {
      product_id: 4,
      name: 'Gỏi Bò Bóp Thấu',
      description: 'Burger với hai lớp thịt bò và phô mai tan chảy.',
      category_id: 1,
      price: 192000,
      status: true,
      sold: 80,
      avg_rating: 4.7,
      product_url: '/menu/khaivi/goibobopthau.jpeg'
    },
    {
      product_id: 5,
      name: 'Gỏi Bò Ngũ Sắc',
      description: 'Burger với hai lớp thịt bò và phô mai tan chảy.',
      category_id: 1,
      price: 192000,
      status: true,
      sold: 80,
      avg_rating: 4.7,
      product_url: '/menu/khaivi/goibongusac.jpeg'
    },
    {
      product_id: 6,
      name: 'Gỏi Bưởi',
      description: 'Burger với hai lớp thịt bò và phô mai tan chảy.',
      category_id: 1,
      price: 192000,
      status: true,
      sold: 80,
      avg_rating: 4.7,
      product_url: '/menu/khaivi/goibuoi.jpeg'
    },
    {
      product_id: 7,
      name: 'Gỏi Mít',
      description: 'Burger với hai lớp thịt bò và phô mai tan chảy.',
      category_id: 1,
      price: 192000,
      status: true,
      sold: 80,
      avg_rating: 4.7,
      product_url: '/menu/khaivi/goimit.jpeg'
    },
    {
      product_id: 8,
      name: 'Gỏi Sứa',
      description: 'Burger với hai lớp thịt bò và phô mai tan chảy.',
      category_id: 1,
      price: 192000,
      status: true,
      sold: 80,
      avg_rating: 4.7,
      product_url: '/menu/khaivi/goisua.jpeg'
    },
    {
      product_id: 9,
      name: 'Gỏi Xoài',
      description: 'Burger với hai lớp thịt bò và phô mai tan chảy.',
      category_id: 1,
      price: 192000,
      status: true,
      sold: 80,
      avg_rating: 4.7,
      product_url: '/menu/khaivi/goixoai.jpeg'
    },
    {
      product_id: 10,
      name: 'Nem Công Chả Phụng',
      description: 'Burger với hai lớp thịt bò và phô mai tan chảy.',
      category_id: 1,
      price: 192000,
      status: true,
      sold: 80,
      avg_rating: 4.7,
      product_url: '/menu/khaivi/nemcongchaphung.jpeg'
    },
    {
      product_id: 11,
      name: 'Nem Cua Bể',
      description: 'Burger với hai lớp thịt bò và phô mai tan chảy.',
      category_id: 1,
      price: 192000,
      status: true,
      sold: 80,
      avg_rating: 4.7,
      product_url: '/menu/khaivi/nemcuabe.jpeg'
    },
    {
      product_id: 12,
      name: 'Ốc Bươu Nhồi Thịt',
      description: 'Burger với hai lớp thịt bò và phô mai tan chảy.',
      category_id: 1,
      price: 192000,
      status: true,
      sold: 80,
      avg_rating: 4.7,
      product_url: '/menu/khaivi/ocbuounhoithit.jpeg'
    },
    {
      product_id: 13,
      name: 'Soup Gà Nấm',
      description: 'Burger với hai lớp thịt bò và phô mai tan chảy.',
      category_id: 1,
      price: 192000,
      status: true,
      sold: 80,
      avg_rating: 4.7,
      product_url: '/menu/khaivi/soupganam.jpeg'
    },
    // Món chính
    {
      product_id: 14,
      name: 'Bò Kho Bánh Mì',
      description: 'Pizza truyền thống với sốt cà chua, phô mai và pepperoni.',
      category_id: 2,
      price: 216000,
      status: true,
      sold: 150,
      avg_rating: 4.6,
      product_url: '/menu/monchinh/bokho.jpeg'
    },
    {
      product_id: 15,
      name: 'Cá Hú Kho Tộ',
      description: 'Pizza với sốt cà chua, phô mai mozzarella và húng quế.',
      category_id: 2,
      price: 192000,
      status: true,
      sold: 85,
      avg_rating: 4.2,
      product_url: '/menu/monchinh/cahukhoto.jpeg'
    },
    {
      product_id: 16,
      name: 'Cải Thìa Xào Dầu Hào',
      description: 'Pizza với dứa, giăm bông và phô mai mozzarella.',
      category_id: 2,
      price: 228000,
      status: true,
      sold: 60,
      avg_rating: 4.1,
      product_url: '/menu/monchinh/caithiaxaodauhao.jpeg'
    },
    {
      product_id: 17,
      name: 'Cá Lóc Hấp Nước Cốt Dừa',
      description: '2 miếng gà rán giòn với lớp bột vàng rộm.',
      category_id: 2,
      price: 120000,
      status: true,
      sold: 200,
      avg_rating: 4.7,
      product_url: '/menu/monchinh/calochapnuoccotdua.jpeg'
    },
    {
      product_id: 18,
      name: 'Canh Chua Cá Hú',
      description: '10 miếng gà nugget chiên giòn, chấm với sốt.',
      category_id: 2,
      price: 132000,
      status: true,
      sold: 175,
      avg_rating: 4.4,
      product_url: '/menu/monchinh/canhchuacahu.jpeg'
    },
    {
      product_id: 19,
      name: 'Canh Khoai Mỡ',
      description: 'Cánh gà cay với lớp gia vị đặc biệt.',
      category_id: 2,
      price: 168000,
      status: true,
      sold: 90,
      avg_rating: 4.6,
      product_url: '/menu/monchinh/canhkhoaimo.jpeg'
    },
    {
      product_id: 20,
      name: 'Cơm Hấp Lá Sen',
      description: 'Cánh gà cay với lớp gia vị đặc biệt.',
      category_id: 2,
      price: 168000,
      status: true,
      sold: 90,
      avg_rating: 4.6,
      product_url: '/menu/monchinh/comhaplasen.jpeg'
    },
    {
      product_id: 21,
      name: 'Lẩu Hoa Đồng Nội',
      description: 'Cánh gà cay với lớp gia vị đặc biệt.',
      category_id: 2,
      price: 168000,
      status: true,
      sold: 90,
      avg_rating: 4.6,
      product_url: '/menu/monchinh/lauhoadongnoi.jpeg'
    },
    {
      product_id: 22,
      name: 'Lẩu Mắm',
      description: 'Cánh gà cay với lớp gia vị đặc biệt.',
      category_id: 2,
      price: 168000,
      status: true,
      sold: 90,
      avg_rating: 4.6,
      product_url: '/menu/monchinh/laumam.jpeg'
    },
    {
      product_id: 23,
      name: 'Tôm Càng Kho Tàu',
      description: 'Cánh gà cay với lớp gia vị đặc biệt.',
      category_id: 2,
      price: 168000,
      status: true,
      sold: 90,
      avg_rating: 4.6,
      product_url: '/menu/monchinh/tomcangkhotau.jpeg'
    },
    {
      product_id: 24,
      name: 'Tôm Rang Me',
      description: 'Cánh gà cay với lớp gia vị đặc biệt.',
      category_id: 2,
      price: 168000,
      status: true,
      sold: 90,
      avg_rating: 4.6,
      product_url: '/menu/monchinh/tomrangme.jpeg'
    },
    {
      product_id: 25,
      name: 'Vịt Om Sấu',
      description: 'Cánh gà cay với lớp gia vị đặc biệt.',
      category_id: 2,
      price: 168000,
      status: true,
      sold: 90,
      avg_rating: 4.6,
      product_url: '/menu/monchinh/vitomsau.jpeg'
    },
    // Món phụ
    {
      product_id: 26,
      name: 'Bánh Bèo Tôm Cháy',
      description: 'Khoai tây chiên giòn, thêm chút muối và gia vị.',
      category_id: 3,
      price: 72000,
      status: true,
      sold: 300,
      avg_rating: 4.5,
      product_url: '/menu/monphu/banhbeotomchay.jpeg'
    },
    {
      product_id: 27,
      name: 'Bánh Bột Lọc',
      description: 'Hành tây chiên giòn, ăn kèm với sốt.',
      category_id: 3,
      price: 84000,
      status: true,
      sold: 120,
      avg_rating: 4.3,
      product_url: '/menu/monphu/banhbotloc.jpeg'
    },
    {
      product_id: 28,
      name: 'Bánh Chuối Nướng',
      description: 'Phô mai que chiên giòn tan chảy.',
      category_id: 3,
      price: 120000,
      status: true,
      sold: 75,
      avg_rating: 4.8,
      product_url: '/menu/monphu/banhchuoinuong.jpeg'
    },
    {
      product_id: 29,
      name: 'Bánh Đậu Xanh',
      description: 'Phô mai que chiên giòn tan chảy.',
      category_id: 3,
      price: 120000,
      status: true,
      sold: 75,
      avg_rating: 4.8,
      product_url: '/menu/monphu/banhdauxanh.jpeg'
    },
    {
      product_id: 30,
      name: 'Bánh Đúc',
      description: 'Phô mai que chiên giòn tan chảy.',
      category_id: 3,
      price: 120000,
      status: true,
      sold: 75,
      avg_rating: 4.8,
      product_url: '/menu/monphu/banhduc.jpeg'
    },
    {
      product_id: 31,
      name: 'Bánh Gói Đậu Xanh',
      description: 'Phô mai que chiên giòn tan chảy.',
      category_id: 3,
      price: 120000,
      status: true,
      sold: 75,
      avg_rating: 4.8,
      product_url: '/menu/monphu/banhgoidauxanh.jpeg'
    },
    {
      product_id: 32,
      name: 'Bánh Ít Trần',
      description: 'Phô mai que chiên giòn tan chảy.',
      category_id: 3,
      price: 120000,
      status: true,
      sold: 75,
      avg_rating: 4.8,
      product_url: '/menu/monphu/banhittran.jpeg'
    },
    {
      product_id: 33,
      name: 'Rau Câu',
      description: 'Phô mai que chiên giòn tan chảy.',
      category_id: 3,
      price: 120000,
      status: true,
      sold: 75,
      avg_rating: 4.8,
      product_url: '/menu/monphu/raucau.jpeg'
    },
    // Đồ uống
    {
      product_id: 34,
      name: 'Coca-Cola',
      description: 'Nước ngọt có ga, giải khát.',
      category_id: 4,
      price: 36000,
      status: true,
      sold: 500,
      avg_rating: 4.8,
      product_url: 'https://i.postimg.cc/65rMxhg5/temp-Imagei-G1jv-L.avif'
    },
    {
      product_id: 35,
      name: 'Milkshake (Chocolate)',
      description: 'Milkshake vị socola béo ngậy, thêm kem tươi.',
      category_id: 4,
      price: 96000,
      status: true,
      sold: 90,
      avg_rating: 4.6,
      product_url: 'https://i.postimg.cc/j2V4GWh7/temp-Imagekron-VZ.avif'
    },
    {
      product_id: 36,
      name: 'Iced Lemon Tea',
      description: 'Trà chanh mát lạnh, giải nhiệt mùa hè.',
      category_id: 4,
      price: 60000,
      status: true,
      sold: 180,
      avg_rating: 4.5,
      product_url: 'https://i.postimg.cc/9QPK12Cb/temp-Imagel39au-D.avif'
    },
    {
      product_id: 37,
      name: 'Chè Lê Tuyết Nhĩ',
      description: 'Trà chanh mát lạnh, giải nhiệt mùa hè.',
      category_id: 4,
      price: 60000,
      status: true,
      sold: 180,
      avg_rating: 4.5,
      product_url: '/menu/thucuong/cheletuyetnhi.jpeg'
    }
  ]);
};
