drop database taihen;

-- Start
select user();
CREATE USER 'b9793d0b8e99d6'@'us-cdbr-iron-east-04.cleardb.net'
  IDENTIFIED BY '81c0149c';
GRANT ALL
  ON *.*
  TO 'b9793d0b8e99d6'@'us-cdbr-iron-east-04.cleardb.net'
  WITH GRANT OPTION;
create database taihen CHARACTER SET utf8 COLLATE utf8_general_ci;
use heroku_85e7c5d6d301ddc;
use taihen;

SET FOREIGN_KEY_CHECKS = 0;
create table category(
	cat_ID int(20)primary key auto_increment,
    cat_name varchar(20),
    cat_des varchar(100),
    cat_pic varchar(100)
);
alter table category auto_increment=0;
create table article(
	ar_ID int primary key,
    ar_name varchar(100),
    ar_pic varchar(100),
    ar_chap_num int,
    ar_view int default 0,
    ar_des varchar(10000),
    ar_date date,
    ar_stt int
);
create table chapter(
	chap_ID int,
    ar_ID int,
    chap_page int,
    chap_name varchar(100),
    chap_date date,
    primary key (chap_ID, ar_ID),
    foreign key chapter(ar_ID) references article(ar_ID)
);
alter table chapter auto_increment=0;
create table ar_cat(
	cat_ID int,
    ar_ID int,
    primary key (cat_ID, ar_ID),
    foreign key ar_cat(ar_ID) references article(ar_ID),
    foreign key ar_cat(cat_ID) references category(cat_ID)
);
create table count_view(
	ar_ID int,
    `time` date,
    foreign key count_view(ar_ID) references article(ar_ID)
);
create table pic(
	pic_ID int(20)primary key auto_increment,
    pic_name varchar(50)
);
CREATE TABLE `account`(
	accID int primary key,
    `email` varchar(50),
    `password` varchar(50)
);
SET FOREIGN_KEY_CHECKS = 1;
insert into category (cat_name, cat_des) values 
('3D Hentai', 'Truyện 3D'),
('Action', 'Hành động kịch tính'),
('Adult', 'Nhân vật người lớn'),
('Adventure', 'Phiêu lưu, thám hiểm'),
('Ahegao', 'Gương mặt lên đỉnh, biểu cảm dâm dục'),
('Anal', 'Chơi lỗ hậu'),
('Angel', 'Nhân vật là thần, thiên thần,...'),
('Animal', 'Động vật'),
('Animal girl', 'Những cô gái có đặc điểm của động vật'),
('BBM', 'Người đàn ông béo'),
('BBW', 'Người phụ nữ mũm mĩm, sexy'),
('BDSM', 'Bạo dâm'),
('Bestiality', 'Sex với côn trùng, thú vật'),
('Big Ass', 'Mông to'),
('Big Boobs', 'Zú to'),
('Big Penis', 'Khoai to'),
('Blackmail', 'Tống tiền'),
('BlowJobs', 'Bú đồng aka bú cu'),
('Body Swap', 'Hoàn đổi cơ thể, xoay chuyển càn khôn'),
('Bodysuit', 'Áo liền quần'),
('Bondage', 'Bạo dâm kiểu trói'),
('Breast', 'Quan hệ tình dục với ngực'),
('Breast Sucking', 'Bú ti'),
('BreastJobs', 'Thẩm du bằng ngực'),
('Brother', 'Anh/em trai'),
('Business Suit', 'Đồng phục công sở'),
('Catgirls', 'Miêu nữ'),
('Che ít', 'Che ít, vẫn đủ nhìn'),
('Che nhiều', 'Che gần như toàn bộ bộ phận nhạy cảm'),
('Cheating', 'Ngoại tình'),
('Chikan', 'Quấy rối tình dục nơi công cộng'),
('Comedy', 'Hài hước'),
('Comic', 'Nét vẽ chân thực đến từ Châu Âu'),
('Condom', 'Dùng ba con sói'),
('Cosplay', 'Cosplay các nhân vật trong anime, maid, học sinh'),
('Cunnilingus', 'Hoạt động thỏa mãn âm đạo aka vét máng'),
('Dark Skin', 'Da tối màu'),
('Daughter', 'Con gái'),
('Deepthroat', 'Đẳng cấp cao hơn của bú đồng, sử dụng họng'),
('Demon', 'Quỷ'),
('Dirty', 'Liên quan đến những thứ bẩn bẩn'),
('Dirty Old Man', 'Những ông già rơi mất liêm sỉ'),
('DogGirl', 'Cẩu nữ'),
('Double Penetration', 'Chơi 2 lỗ'),
('Drug', 'Chơi thuốc hoặc bị đánh thuốc'),
('Ecchi', 'Ít show bộ phận nhạy cảm'),
('Elder Sister', 'Chị gái'),
('Elf', 'Yêu Tinh'),
('Exhibitionism', 'Nhìn lén, nhìn trộm'),
('Fantasy', 'Thế giới tưởng tượng, thần tiên'),
('Father', 'Bố'),
('Femdom', 'Nhân vật nữ chi phối'),
('Fingering', 'Hành động dùng tay móc'),
('Footjob', 'Dùng chân thẩm du'),
('Full Color', 'Full màu'),
('Furry', 'Nhân vật động vật nhưng có dáng người'),
('Futanari', 'CÚ CÓ GAI'),
('Gay', 'Nam Nam'),
('Game', 'Nội dung liên quan đến game'),
('GangBang', 'Làm tình tập thể'),
('Garter Belts', 'Dây gắn giữa quần tất và quần chip'),
('Gender Bender', 'Đảo lộn giới tính'),
('Ghost', 'Ma'),
('Glasses', 'Nhân vật đeo kính'),
('Group', 'Nhiều cặp đôi làm tình'),
('Guro', 'Máu me, ghê rợn'),
('Hairy', 'Lông rậm rạp'),
('Handjob', 'Dùng tay kích thích, thẩm du'),
('Harem', 'Nhiều nữ thích 1 nam'),
('Horror', 'Kinh dị'),
('Housewife', 'Người nội trợ'),
('Humiliation', 'Làm nhục, lăng mạ'),
('Idol', 'Thần tượng giới trẻ'),
('Incest', 'Loạn luân'),
('Insect', 'Côn trùng'),
('Không che', 'Không che tí nào'),
('Kuudere', 'Bên ngoài lạnh lùng bên trong thẹn thùng'),
('Lesbian', 'Nữ nữ'),
('Loli', 'Trẻ em nhỏ. FBI OPEN UP!!'),
('Maids', 'Người hầu'),
('Manhwa', 'Hàn xẻng'),
('Masturbation', 'Thẩm du'),
('Milf', 'Người phụ nữ có tuổi'),
('Mind Break', 'Sa ngã dục vọng'),
('Mind Control', 'Điều khiển tâm trí'),
('Mizugi', 'Đồ bơi Nhật Bản'),
('Monster', 'Quái vật'),
('Monstergirl', 'Nữ quái'),
('Mother', 'Mẹ'),
('Nakadashi', 'Tinh dịch tràn ra ngoài'),
('Netori', 'Main đi trồng sừng'),
('NTR', 'Main bị cắm sừng'),
('Nun', 'Sơ trong nhà thờ'),
('Nurse', 'Y tá'),
('Old Man', 'Người già'),
('Oneshot', 'Truyện 1 chap'),
('Oral', 'Hoạt động sinh dục bằng miệng'),
('Pantyhose', 'Quần tất'),
('Pregnant', 'Có chửa'),
('Rape', 'Hiếp dâm'),
('Rimjob', 'Liếm, kích thích lỗ hậu'),
('Romance', 'Lãng mạng'),
('School Uniform', 'Đồng phục học sinh'),
('SchoolGirl', 'Nữ sinh'),
('Series', 'Truyện nhiều tập'),
('Sex Toys', 'Sử dụng đồ chơi tình dục'),
('Shimapan', 'Quần lót sọc xanh đỏ'),
('Shota', 'Nam tuổi vị thành niên'),
('Sister', 'Chị em gái'),
('Slave', 'Nô lệ tình dục'),
('Sleeping', 'Ngủ'),
('Small Boobs', 'Ngực nhỏ'),
('Sports', 'Thể thao'),
('Stockings', 'Tất dài'),
('Supernatural', 'Siêu nhiên'),
('Sweating', 'Mồ hôi nhễ nhại'),
('Swimsuit', 'Đồ bơi'),
('Teacher', 'Giáo viên'),
('Tentacles', 'Xúc tu'),
('Time Stop', 'Ngưng đọng thời gian'),
('Tomboy', 'Nhân vật nữ cư xử như nam giới'),
('Tracksuit', 'Quàn áo tập thể thao'),
('Transformation', 'Biến đổi thân thế'),
('Trap', 'Nam nhưng mặc giống nữ'),
('Tsundere', 'Ứng xử ngược với cảm xúc'),
('Twins', 'Sinh đôi'),
('Twintails', 'Tóc 2 bím'),
('Virgin', 'Còn zin'),
('X-ray', 'Nhìn xuyên vào trong cơ thể'),
('Yandere', 'Yêu mù quáng, tiêu cực'),
('Yuri', 'Nữ x nữ x nam'),
('Zombie', 'Xác sống');

insert into pic (pic_name) values('1.jpg');
insert into pic (pic_name) values('2.jpg');
insert into pic (pic_name) values('3.jpg');
insert into pic (pic_name) values('4.jpg');

insert into article (ar_ID, ar_name, ar_pic, ar_chap_num, ar_des, ar_date, ar_stt) 
values
(1, 'Kimetsu no Yaiba', 'kimetsu-no-yaiba_1478064120.jpg', 2, 'Kimetsu no Yaiba – Tanjirou là con cả của gia đình vừa mất cha. Một ngày nọ, Tanjirou đến thăm thị trấn khác để bán than, khi đêm về cậu ở nghỉ tại nhà người khác thay vì về nhà vì lời đồn thổi về ác quỷ luôn rình mò gần núi vào buổi tối. Khi cậu về nhà vào ngày hôm sau, bị kịch đang đợi chờ cậu…', utc_date(), 0),
(2, 'Onepunch Man', 'onepunch-man_1552232163.jpg', 1, 'Onepunch-Man là một Manga thể loại siêu anh hùng với đặc trưng phồng tôm đấm phát chết luôn… Lol!!! Nhân vật chính trong Onepunch-man là Saitama, một con người mà nhìn đâu cũng thấy “tầm thường”, từ khuôn mặt vô hồn, cái đầu trọc lóc, cho tới thể hình long tong. Tuy nhiên, con người nhìn thì tầm thường này lại chuyên giải quyết những vấn đề hết sức bất thường. Anh thực chất chính là một siêu anh hùng luôn tìm kiếm cho mình một đối thủ mạnh. Vấn đề là, cứ mỗi lần bắt gặp một đối thủ tiềm năng, thì đối thủ nào cũng như đối thủ nào, chỉ ăn một đấm của anh là… chết luôn. Liệu rằng Onepunch-Man Saitaman có thể tìm được cho mình một kẻ ác dữ dằn đủ sức đấu với anh? Hãy theo bước Saitama trên con đường một đấm tìm đối cực kỳ hài hước của anh!!', utc_date(), 0),
(3, 'Học Viện Cao Thủ', 'hoc-vien-cao-thu_1583732267.jpg', 1, 'Phách lối không phải là sai, cuồng vọng không phải tội, ta bản mạnh nhất, không cần để ý! Giáo hoa, người mẫu, ngự tỷ, ta đã thích, mang tới liền!', utc_date(), 0),
(4, 'Black Clover', 'black-clover_1552555341.jpg', 1, 'Aster và Yuno là hai đứa trẻ bị bỏ rơi ở nhà thờ và cùng nhau lớn lên tại đó. Khi còn nhỏ, chúng đã hứa với nhau xem ai sẽ trở thành Ma pháp vương tiếp theo. Thế nhưng, khi cả hai lớn lên, mọi sô chuyện đã thay đổi. Yuno là thiên tài ma pháp với sức mạnh tuyệt đỉnh trong khi Aster lại không thể sử dụng ma pháp và cố gắng bù đắp bằng thể lực. Khi cả hai được nhận sách phép vào tuổi 15, Yuno đã được ban cuốn sách phép cỏ bốn bá (trong khi đa số là cỏ ba lá) mà Aster lại không có cuốn nào. Tuy nhiên, khi Yuno bị đe dọa, sự thật về sức mạnh của Aster đã được giải mã- cậu ta được ban cuốn sách phép cỏ năm lá, cuốn sách phá ma thuật màu đen. Bấy giờ, hai người bạn trẻ đang hướng ra thế giới, cùng chung mục tiêu.', utc_date(), 0),
(5, 'Đảo Hải Tặc', 'dao-hai-tac_1552224567.jpg', 1, 'One Piece là câu truyện kể về Luffy và các thuyền viên của mình. Khi còn nhỏ, Luffy ước mơ trở thành Vua Hải Tặc. Cuộc sống của cậu bé thay đổi khi cậu vô tình có được sức mạnh có thể co dãn như cao su, nhưng đổi lại, cậu không bao giờ có thể bơi được nữa. Giờ đây, Luffy cùng những người bạn hải tặc của mình ra khơi tìm kiếm kho báu One Piece, kho báu vĩ đại nhất trên thế giới.', utc_date(), 0),
(6, 'Vượt Qua Giới Hạn', 'vuot-qua-gioi-han_1585881352.jpg', 1, 'Mang trong người một cuộc đời bất hạnh, Shin Youngwoo bấy giờ phải xúc đất và bốc gạch tại những công trình xây dựng. Cậu thậm chí phải lao động chân tay trong một trò chơi thực tế ảo có tên là Viên Mãn Giới!', utc_date(), 0),
(7, 'Học Viện Siêu Anh Hùng: Quái Hiệp', 'hoc-vien-sieu-anh-hung-quai-hiep_1588211904.jpg', 1, 'Ngoại truyện của Học Viện Anh Hùng kể câu chuyện về những Quái hiệp (Các anh hùng không chính thống, tự phát)
Hành trình của Mega là một đường thẳng chỉ vì gặp nờ rờ mà rẽ ngang....', utc_date(), 0),
(8, 'Kamen Rider 913 - Kaixa', 'kamen-rider-913-kaixa_1586616353.jpg', 1, 'Chắc hẳn những bạn đã từng xem Kamen Rider Faiz (555) còn nhớ cái tên Kusaka Masato - Kamen Rider Kai(sand)xa số siêu nhọ nhỉ? Đây là 1 side-manga nói về Kusaka Masato - Kamen Rider Kaixa (913) khi anh được vào vai nhân vật chính thay cho Takumi trên con đường chiến đấu chống lại Orphnoch.Liệu anh ấy có thể thay đổi được số mệnh của mình so với TV series 555 và đến với cô bạn thân Sonoda Mari không? Hay anh ấy vẫn chịu số mệnh trở thành tro bụi?', utc_date(), 0),
(9, 'Pocket Monsters - Festival Of Champions', 'pocket-monsters-festival-of-champions_1584374109.jpg', 1, 'Kết hợp tính logic của game và sự ảo diệu của anime để một lần nữa kể lại câu chuyện của Red và Green', utc_date(), 0),
(10, 'Dungeon Reset', 'dungeon-reset_1583732177.jpg', 1, 'Một tháng trước, không hiểu vì lý do gì mà main lại được triệu hồi đến thế giới gọi là "hầm ngục" (có rất nhiều người cũng bị triệu hồi giống main). Nhưng mỗi một con người được triệu hồi, họ đều có một kỹ năng đặc biệt riêng. Nhưng riêng main lại có một kỹ năng mang tên Fuho (xây dựng) được cho là phế vật.', utc_date(), 0)
;


SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT;
SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS;
SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION;
SET NAMES utf8;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0; 

insert into ar_cat (ar_ID, cat_ID) values (1, 1);
insert into ar_cat (ar_ID, cat_ID) values (1, 2);
insert into ar_cat (ar_ID, cat_ID) values (1, 3);
insert into ar_cat (ar_ID, cat_ID) values (1, 4);
insert into ar_cat (ar_ID, cat_ID) values (1, 5);
insert into ar_cat (ar_ID, cat_ID) values (2, 6);
insert into ar_cat (ar_ID, cat_ID) values (2, 7);
insert into ar_cat (ar_ID, cat_ID) values (2, 8);
insert into ar_cat (ar_ID, cat_ID) values (2, 9);
insert into ar_cat (ar_ID, cat_ID) values (2, 10);
insert into ar_cat (ar_ID, cat_ID) values (3, 11);
insert into ar_cat (ar_ID, cat_ID) values (3, 12);
insert into ar_cat (ar_ID, cat_ID) values (3, 13);
insert into ar_cat (ar_ID, cat_ID) values (3, 14);
insert into ar_cat (ar_ID, cat_ID) values (3, 15);
insert into ar_cat (ar_ID, cat_ID) values (4, 16);
insert into ar_cat (ar_ID, cat_ID) values (4, 17);
insert into ar_cat (ar_ID, cat_ID) values (4, 18);
insert into ar_cat (ar_ID, cat_ID) values (4, 19);
insert into ar_cat (ar_ID, cat_ID) values (4, 20);
insert into ar_cat (ar_ID, cat_ID) values (5, 21);
insert into ar_cat (ar_ID, cat_ID) values (5, 22);
insert into ar_cat (ar_ID, cat_ID) values (5, 23);
insert into ar_cat (ar_ID, cat_ID) values (5, 24);
insert into ar_cat (ar_ID, cat_ID) values (5, 25);
insert into ar_cat (ar_ID, cat_ID) values (6, 26);
insert into ar_cat (ar_ID, cat_ID) values (6, 27);
insert into ar_cat (ar_ID, cat_ID) values (6, 28);
insert into ar_cat (ar_ID, cat_ID) values (6, 29);
insert into ar_cat (ar_ID, cat_ID) values (6, 30);
insert into ar_cat (ar_ID, cat_ID) values (7, 31);
insert into ar_cat (ar_ID, cat_ID) values (7, 32);
insert into ar_cat (ar_ID, cat_ID) values (7, 33);
insert into ar_cat (ar_ID, cat_ID) values (7, 34);
insert into ar_cat (ar_ID, cat_ID) values (7, 35);
insert into ar_cat (ar_ID, cat_ID) values (8, 36);
insert into ar_cat (ar_ID, cat_ID) values (8, 37);
insert into ar_cat (ar_ID, cat_ID) values (8, 38);
insert into ar_cat (ar_ID, cat_ID) values (8, 39);
insert into ar_cat (ar_ID, cat_ID) values (8, 40);
insert into ar_cat (ar_ID, cat_ID) values (9, 41);
insert into ar_cat (ar_ID, cat_ID) values (9, 42);
insert into ar_cat (ar_ID, cat_ID) values (9, 43);
insert into ar_cat (ar_ID, cat_ID) values (9, 44);
insert into ar_cat (ar_ID, cat_ID) values (9, 45);
insert into ar_cat (ar_ID, cat_ID) values (10, 46);
insert into ar_cat (ar_ID, cat_ID) values (10, 47);
insert into ar_cat (ar_ID, cat_ID) values (10, 48);
insert into ar_cat (ar_ID, cat_ID) values (10, 49);
insert into ar_cat (ar_ID, cat_ID) values (10, 50);

insert into chapter (ar_ID, chap_ID, chap_page, chap_name, chap_date) 
values
(1, 1, 15, 'Chương 1', utc_date()),
(1, 2, 22, 'Chương 2', utc_date()),
(2, 1, 10, 'Chương 1', utc_date()),
(3, 1, 10, 'Chương 1', utc_date()),
(4, 1, 10, 'Chương 1', utc_date()),
(5, 1, 10, 'Chương 1', utc_date()),
(6, 1, 10, 'Chương 1', utc_date()),
(7, 1, 10, 'Chương 1', utc_date()),
(8, 1, 10, 'Chương 1', utc_date()),
(9, 1, 10, 'Chương 1', utc_date()),
(10, 1, 10, 'Chương 1', utc_date())
;
insert into chapter (ar_ID, chap_ID, chap_page, chap_name, chap_date) 
values
(1, 2, 22, 'Chương 2', utc_date());

insert into `count_view`(ar_ID, `time`) 
values
(1, utc_date()),
(1, utc_date()),
(1, utc_date()),
(2, utc_date()),
(3, utc_date()),
(4, utc_date()),
(5, utc_date()),
(6, utc_date()),
(7, utc_date()),
(8, utc_date()),
(9, utc_date()),
(9, utc_date()),
(10, utc_date())
;

insert into `account`(accID, email, `password`) VALUES(1, 'adminkienmilo@taihen.inc', 'G34r1#c42&');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT;
SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS;
SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION;
SET SQL_NOTES=@OLD_SQL_NOTES; 

select * from chapter where ar_ID = 1;
select * from category LIMIT 0, 10;
select * from count_view;
select * from article;
select * from chapter;
SELECT * FROM ar_cat INNER JOIN category ON category.cat_ID = ar_cat.cat_ID WHERE ar_cat.ar_ID = 1;
SELECT * FROM article ORDER BY article.ar_date DESC;
SELECT * from chapter where chapter.ar_ID = 1 ORDER BY chapter.chap_ID DESC LIMIT 1;
SELECT * FROM article ORDER BY article.ar_view DESC LIMIT 6;
SELECT distinct * FROM article 
LEFT JOIN (SELECT * FROM chapter where chapter.ar_ID = article.ar_ID ORDER BY chapter.chap_ID DESC) as temp ON temp.ar_ID = article.ar_ID LIMIT 10;

SELECT count_view.ar_ID, article.ar_name, article.ar_pic, COUNT(count_view.ar_ID) as num 
FROM count_view 
INNER JOIN article
ON count_view.ar_ID = article.ar_ID
WHERE MONTH(count_view.`time`) = MONTH(curdate()) 
GROUP BY count_view.ar_ID 
ORDER BY num DESC LIMIT 8;

SET FOREIGN_KEY_CHECKS = 1;
drop table chapter;



