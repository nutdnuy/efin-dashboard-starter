# ใช้ Matt Pocock Skills เดิมกับโปรเจกต์นี้

Skills เก็บวิธีทำงานที่ใช้ซ้ำ ส่วนโปรเจกต์นี้เก็บบริบทหุ้นไทย รูปแบบ CSV สูตร และเกณฑ์ตรวจรับ การแยกสองส่วนทำให้ใช้ Skills เดิมต่อได้ โดยไม่ต้องแก้ทุก `SKILL.md` ให้รู้จัก Efin

Starter ไม่ติดตั้ง คัดลอก หรือแก้ upstream Skills การเปิด Dashboard และคำสั่งตรวจข้อมูลใช้ได้โดยไม่มี Skills

## เริ่มจากสิ่งที่ติดตั้งอยู่จริง

เปิดรายการ Skills ในแอปที่ใช้ หรือให้ Agent ตรวจรายการที่เครื่องมือนั้นเปิดให้ แล้วเทียบทั้ง **ชื่อ**, **คำอธิบาย**, และ **วิธีเรียก** อย่าสรุปว่า Skill ติดตั้งอยู่เพียงเพราะมีชื่อในเอกสารนี้

สำเนาที่เคยติดตั้งอาจใช้ชื่อขึ้นต้น `mattpocock-` ส่วน [upstream ปัจจุบัน](https://github.com/mattpocock/skills) ใช้ชื่อสั้น และแยกโฟลเดอร์ engineering/productivity ตารางนี้ช่วยค้นหา ไม่รับรองว่าไฟล์ต่างรุ่นมีพฤติกรรมเหมือนกันทุกข้อ

| ชื่อในชุดเดิมที่อาจพบ | ชื่อ upstream ปัจจุบัน | ใช้เมื่อ |
|---|---|---|
| `mattpocock-research` | `research` | ตรวจคำถามกับแหล่งข้อมูลหลักแล้วบันทึกหลักฐาน |
| `mattpocock-grilling` | `grilling` | วิธีสัมภาษณ์เพื่อคลี่โจทย์ที่ยังไม่ชัด |
| `mattpocock-grill-me` | `grill-me` | ผู้เรียนต้องการเริ่มบทสนทนาสัมภาษณ์โจทย์ |
| `mattpocock-tdd` | `tdd` | เพิ่มพฤติกรรมผ่านวงจร test ก่อน implementation |
| `mattpocock-diagnosing-bugs` | `diagnosing-bugs` | ทำให้บั๊กเกิดซ้ำ แยกสาเหตุ และตรวจ regression |
| `mattpocock-code-review` | `code-review` | ตรวจ diff เทียบมาตรฐานและโจทย์ที่ตกลง |

การใช้ชื่อเดิมใน prompt ไม่ทำให้ชื่อใหม่เกิดขึ้นอัตโนมัติ และไม่ควรสร้าง alias ด้วยการเขียนทับ Skill เดิม ให้ใช้ชื่อที่ปรากฏจริงในแอปนั้น

## ใครเป็นคนเรียก Skill

Upstream ปัจจุบันแยกสองกลุ่ม ตาม[กติกา invocation](https://github.com/mattpocock/skills/blob/main/.agents/invocation.md):

- **User-invoked:** ผู้ใช้ต้องพิมพ์ชื่อ Skill เพื่อเริ่ม เช่น `setup-matt-pocock-skills`, `grill-me`, `grill-with-docs`, `to-spec`, `implement` Agent หรือ Skill อื่นไม่ควรเริ่มแทนเอง
- **Model-invoked:** ผู้ใช้เรียกได้ และ Agent เลือกใช้ได้เมื่อเหมาะกับงาน เช่น `research`, `grilling`, `prototype`, `tdd`, `diagnosing-bugs`, `code-review`

ตรวจ `disable-model-invocation` ใน `SKILL.md` และ `policy.allow_implicit_invocation` ใน `agents/openai.yaml` ของรุ่นที่ติดตั้ง ถ้ากติกาของแอปหรือ Skill จำกัดมากกว่าตาราง ให้ยึดข้อจำกัดนั้น

การมีชื่อ Skill ในตาราง routing เป็นคำแนะนำในการเลือก ไม่ใช่การอนุญาตข้ามข้อกำหนดของ Skill บางตัวอาจต้องตกลงขอบเขตทดสอบหรือจุดเริ่ม diff ก่อนทำงาน

## ถ้าต้องติดตั้งใหม่

อ่าน[วิธีติดตั้งจากผู้พัฒนา](https://github.com/mattpocock/skills#installation-30-second-setup) ให้ตรงกับแอปและเวอร์ชันของคุณ เลือกช่องทางเดียวต่อแอป เพื่อไม่ให้สำเนา plugin กับสำเนาไฟล์เกิดชื่อซ้ำ

ถ้าใช้ upstream รุ่นปัจจุบัน ผู้พัฒนาให้ผู้ใช้เรียก `setup-matt-pocock-skills` หนึ่งครั้งต่อ repo เพื่อกำหนด issue tracker และตำแหน่ง domain docs การตั้งค่านี้ควรตรวจไฟล์โปรเจกต์ที่มีอยู่ก่อน ไม่เขียนทับโดยเดา และไม่จำเป็นสำหรับเปิด Dashboard ตัวอย่าง

Starter ไม่รัน installer หรืออัปเดต Skills ให้เอง การติดตั้งใหม่ไม่ใช่เงื่อนไขบังคับของคลาสถ้าคุณมีชุดเดิมที่ใช้งานได้แล้ว

## บริบทที่ส่งให้ Skill

| สิ่งที่ Skill ต้องรู้ | Source of truth ของคลาส |
|---|---|
| กติกาการทำงานและวิธีตรวจ | `AGENTS.md` ที่ root |
| งานที่ผู้เรียนอยากทำ | brief ที่กรอกจาก `templates/dashboard-brief.md` |
| วันที่ รหัส ราคา lookback และสูตร | `docs/data-contract.md` |
| ชื่อหน้า หุ้น benchmark และช่วงคำนวณ | `dashboard.config.json` |
| ความสำเร็จที่ตรวจได้ | `docs/acceptance-checklist.md` |
| เหตุผลที่ใช้โครงสร้างนี้ | `docs/adr/0001-project-context.md` |

เมื่อเปลี่ยนโจทย์ ให้แก้ข้อมูลในจุดเหล่านี้ แล้วเลือก Skills ที่เหมาะ ไม่ต้องใส่ข้อกำหนดหุ้นไทยซ้ำในทุก Skill

## สิ่งที่เราอ้างอิง

ตรวจ upstream วันที่ 2026-10-19: [README](https://github.com/mattpocock/skills/blob/main/README.md), [invocation policy](https://github.com/mattpocock/skills/blob/main/.agents/invocation.md), [setup](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/SKILL.md) เป็นแหล่งอธิบายวิธีใช้ ไม่ได้นำไฟล์เหล่านี้มาแจกซ้ำใน starter
