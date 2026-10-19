# Skills ที่รวมไว้สำหรับคลาส

ชุดนี้คัดลอก **11 คำสั่งหลักตามรายการที่เลือก** จาก [mattpocock/skills](https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336) และเก็บไฟล์ต้นฉบับไว้เหมือนเดิม ภายใต้ MIT License

เริ่มที่ grill-with-docs เพื่อคุยโจทย์ เมื่อเลือกทิศทางแล้วให้ผู้เรียนเรียก to-spec และ implement เพื่อสร้าง ส่วนคำสั่งอื่นเลือกใช้เมื่อจำเป็น ดูตาราง 11 คำสั่งใน [README](../README.md)

## ตัวช่วยที่ต้องติดมาด้วย

คัดลอกอีก **8 สกิลประกอบ** เพราะคำสั่งหลักเรียกใช้จริง การก็อบเฉพาะไฟล์ 11 คำสั่งจะทำให้บาง workflow ขาดส่วนทำงาน

| ตัวช่วย | ใช้ทำอะไร |
|---|---|
| [grilling](../.agents/skills/grilling/SKILL.md) | สัมภาษณ์เพื่อให้เข้าใจโจทย์ร่วมกัน |
| [domain-modeling](../.agents/skills/domain-modeling/SKILL.md) | ทำให้ศัพท์และความหมายในโปรเจกต์ตรงกัน |
| [codebase-design](../.agents/skills/codebase-design/SKILL.md) | ช่วยออกแบบส่วนของโค้ดเมื่อถึงขั้นพัฒนา |
| [prototype](../.agents/skills/prototype/SKILL.md) | สร้างแบบทดลองเพื่อตอบคำถามเรื่องหน้าตาหรือพฤติกรรม |
| [research](../.agents/skills/research/SKILL.md) | ค้นข้อมูลประกอบจากแหล่งอ้างอิง |
| [tdd](../.agents/skills/tdd/SKILL.md) | พัฒนาพร้อมทดสอบพฤติกรรมสำคัญ |
| [code-review](../.agents/skills/code-review/SKILL.md) | ตรวจการเปลี่ยนแปลงกับโจทย์และมาตรฐานโค้ด |
| [writing-for-agents](../.agents/skills/writing-for-agents/SKILL.md) | เขียนคำสั่งที่ Agent อ่านได้ชัดเจน ใช้ใน retro |

## เรียกใช้อย่างไร

- ถ้าแอปค้นพบสกิลในโปรเจกต์ ให้เลือกชื่อสกิลตามวิธีของแอป
- หากไม่มีเมนูหรือ slash command ให้พิมพ์ชัดเจน เช่น **“อ่าน .agents/skills/grill-with-docs/SKILL.md แล้วใช้สกิลนี้ช่วยฉันออกแบบ Dashboard”** การอ่านไฟล์เป็นทางใช้คำสั่งโดยตรง ไม่ใช่การยืนยันว่าแอปติดตั้งสกิลสำเร็จ
- ถ้ามี Matt Pocock Skills ติดตั้งอยู่แล้ว สามารถเลือกใช้ชุดนั้นได้ โดยตรวจชื่อและเวอร์ชันจริง ชุดนี้ไม่ติดตั้งหรือแก้สกิล global ของเครื่อง
- 11 คำสั่งหลักสงวนให้ผู้ใช้เรียก ตัวช่วย 8 ตัวใช้ได้ตาม policy ของแต่ละสกิล ไม่เปิดให้คำสั่งหลักเรียกกันเองโดยอัตโนมัติ
- บางแอปไม่มี subagents หรือ worktrees ให้ใช้ implement แบบทีละส่วนแทน implement-spec
- ask-matt ต้นฉบับกล่าวถึงสกิลนอกชุดนี้ด้วย Agent ต้องตรวจว่ามีจริงก่อนแนะนำให้ใช้ ไม่ถือว่าสกิลเหล่านั้นติดตั้งมาด้วย

## การตั้งค่าที่เตรียมให้

โปรเจกต์เตรียม local Markdown เป็นที่เก็บ spec และงานย่อยใน .scratch/ พร้อมคำศัพท์สถานะและตำแหน่ง glossary แล้ว จึงเริ่มคุยได้ทันที ไม่ต้องเชื่อม GitHub Issues ก่อน ใช้ setup-matt-pocock-skills เมื่อต้องการเปลี่ยนการตั้งค่านี้

โจทย์การลงทุนเก็บใน BRIEF.md กติกาคลาสอยู่ใน AGENTS.md จึงปรับโปรเจกต์โดยไม่แก้ทุก SKILL.md

## ที่มาและการตรวจ

Revision: `49dd158d1076134a641b33efb035946536778336`
ไฟล์และ SHA-256: [skills.lock.json](../skills.lock.json)
ใบอนุญาต: [MIT ของ Matt Pocock](../.agents/skills/LICENSE.mattpocock)

ไฟล์สนับสนุนและ agents/openai.yaml ถูกคัดลอกทั้งชุด ไม่ใช่เฉพาะ SKILL.md ดู [THIRD_PARTY_NOTICES](../THIRD_PARTY_NOTICES.md) สำหรับรายละเอียดการแจกจ่าย
