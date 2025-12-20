-- Migration: Seed sample data for categories and products tables
-- Description: Tạo dữ liệu mẫu cho testing và development (Sprint 2)
-- Created: Sprint 2
-- Note: image_url là placeholder, cần thay bằng URL thực từ Supabase Storage sau khi upload ảnh

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('Áo thun', 'ao-thun', 'Áo thun nam nữ với nhiều kiểu dáng và màu sắc đa dạng'),
  ('Váy', 'vay', 'Váy nữ với các phong cách từ casual đến formal'),
  ('Quần Jeans', 'quan-jeans', 'Quần jeans nam nữ với nhiều kiểu dáng và màu sắc'),
  ('Áo sơ mi', 'ao-so-mi', 'Áo sơ mi nam nữ với chất liệu cao cấp'),
  ('Giày dép', 'giay-dep', 'Giày dép thời trang cho mọi lứa tuổi')
ON CONFLICT (slug) DO NOTHING;

-- Lưu category IDs để sử dụng cho products
-- Lưu ý: Trong thực tế, cần query để lấy IDs, nhưng để đơn giản seed data, 
-- chúng ta sẽ sử dụng subquery hoặc giả định IDs

-- Insert sample products
-- Category: Áo thun (slug: ao-thun)
INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Áo thun basic trắng',
  199000,
  id,
  'Áo thun basic màu trắng, chất liệu cotton 100%, thoáng mát, dễ phối đồ',
  NULL
FROM categories WHERE slug = 'ao-thun'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Áo thun basic đen',
  199000,
  id,
  'Áo thun basic màu đen, chất liệu cotton 100%, form rộng thoải mái',
  NULL
FROM categories WHERE slug = 'ao-thun'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Áo thun graphic xám',
  299000,
  id,
  'Áo thun có họa tiết graphic, màu xám, chất liệu cotton blend',
  NULL
FROM categories WHERE slug = 'ao-thun'
ON CONFLICT DO NOTHING;

-- Category: Váy (slug: vay)
INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Váy maxi hoa nhí',
  599000,
  id,
  'Váy maxi dài với họa tiết hoa nhí, chất liệu voan mềm mại',
  NULL
FROM categories WHERE slug = 'vay'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Váy body đen',
  499000,
  id,
  'Váy body màu đen, ôm sát, phù hợp cho các dịp đặc biệt',
  NULL
FROM categories WHERE slug = 'vay'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Váy chữ A kẻ sọc',
  449000,
  id,
  'Váy chữ A với họa tiết kẻ sọc, chất liệu cotton, dễ mặc',
  NULL
FROM categories WHERE slug = 'vay'
ON CONFLICT DO NOTHING;

-- Category: Quần Jeans (slug: quan-jeans)
INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Quần jeans slim fit xanh đậm',
  799000,
  id,
  'Quần jeans slim fit màu xanh đậm, chất liệu denim cao cấp',
  NULL
FROM categories WHERE slug = 'quan-jeans'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Quần jeans rộng ống xanh nhạt',
  899000,
  id,
  'Quần jeans rộng ống màu xanh nhạt, phong cách streetwear',
  NULL
FROM categories WHERE slug = 'quan-jeans'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Quần jeans skinny đen',
  749000,
  id,
  'Quần jeans skinny màu đen, ôm sát, phù hợp mọi dịp',
  NULL
FROM categories WHERE slug = 'quan-jeans'
ON CONFLICT DO NOTHING;

-- Category: Áo sơ mi (slug: ao-so-mi)
INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Áo sơ mi trắng dài tay',
  399000,
  id,
  'Áo sơ mi trắng dài tay, chất liệu cotton, phù hợp công sở',
  NULL
FROM categories WHERE slug = 'ao-so-mi'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Áo sơ mi kẻ sọc xanh',
  449000,
  id,
  'Áo sơ mi kẻ sọc xanh trắng, dài tay, form rộng thoải mái',
  NULL
FROM categories WHERE slug = 'ao-so-mi'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Áo sơ mi ngắn tay hồng',
  349000,
  id,
  'Áo sơ mi ngắn tay màu hồng pastel, chất liệu cotton mềm mại',
  NULL
FROM categories WHERE slug = 'ao-so-mi'
ON CONFLICT DO NOTHING;

-- Category: Giày dép (slug: giay-dep)
INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Giày sneaker trắng',
  1299000,
  id,
  'Giày sneaker màu trắng, đế cao su, phù hợp mọi hoạt động',
  NULL
FROM categories WHERE slug = 'giay-dep'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Giày cao gót đen',
  899000,
  id,
  'Giày cao gót màu đen, cao 7cm, phù hợp các dịp đặc biệt',
  NULL
FROM categories WHERE slug = 'giay-dep'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, price, category_id, description, image_url)
SELECT 
  'Dép quai hậu nâu',
  199000,
  id,
  'Dép quai hậu màu nâu, đế cao su, thoáng mát, dễ đi',
  NULL
FROM categories WHERE slug = 'giay-dep'
ON CONFLICT DO NOTHING;

-- Lưu ý quan trọng:
-- - image_url hiện tại là NULL, cần upload ảnh lên Supabase Storage và cập nhật URL
-- - Giá sản phẩm là giá mẫu, có thể thay đổi tùy theo thực tế
-- - Trong môi trường production, KHÔNG seed dữ liệu mẫu
-- - Sau khi upload ảnh, cập nhật image_url với format:
--   https://{project-ref}.supabase.co/storage/v1/object/public/product-images/{category_slug}/{product_id}_{timestamp}_{filename}

