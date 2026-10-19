# Skills สำหรับคุยและสร้าง Dashboard

เริ่มด้วย **คุยออกแบบ Dashboard** แล้วใช้ **สร้างและปรับ Dashboard** ทำงานต่อจนได้เวอร์ชันที่ลองใช้ได้ สกิลหลักมี 4 ตัว ชื่อที่แสดงเป็นภาษาไทย และชื่อคำสั่งเป็นภาษาอังกฤษสั้น ๆ

| ชื่อที่แสดง | คำสั่ง | ใช้ทำอะไร |
|---|---|---|
| เลือกตัวช่วย | [choose-skill](../.agents/skills/choose-skill/SKILL.md) | ช่วยเลือกว่าจะเริ่มหรือไปต่ออย่างไร |
| คุยออกแบบ Dashboard | [plan-dashboard](../.agents/skills/plan-dashboard/SKILL.md) | ถามโจทย์ทีละเรื่อง เสนอแบบ จดสิ่งที่เลือก |
| สร้างและปรับ Dashboard | [build-dashboard](../.agents/skills/build-dashboard/SKILL.md) | สรุปโจทย์ วางแผน แบ่งงานเมื่อจำเป็น สร้าง ทดสอบ ตรวจ และปรับต่อ |
| ตั้งค่าโปรเจกต์ | [setup-project](../.agents/skills/setup-project/SKILL.md) | ปรับที่เก็บงาน คำศัพท์ และกติกาโปรเจกต์เมื่อจำเป็น |

## เรียกครั้งเดียว แล้วทำต่อเนื่อง

```text
ใช้ build-dashboard สร้างจากแบบที่เลือก แล้วเปิดให้ลอง
```

งานใหญ่จะจัดการแผนและงานย่อยภายในสกิลเดียว งานเล็กข้ามส่วนที่ไม่จำเป็นได้ เมื่อมีแอปแล้วใช้คำสั่งเดิมเพื่อแก้บั๊กหรือปรับหน้าจอได้ ไม่ต้องสั่งสรุปสเปก แบ่งงาน และสร้างทีละคำสั่ง

คุณยังจำกัดขอบเขตได้ เช่น **“ใช้ build-dashboard วางแผนเพิ่มส่วนปันผลก่อน ยังไม่แก้โค้ด”** หรือ **“ใช้ build-dashboard ตรวจว่าตารางแน่นตรงไหนและเสนอทางแก้”** สกิลต้องยึดขอบเขตนั้น

## ตัวช่วยเบื้องหลัง

Agent เลือกใช้ตามงาน ผู้เรียนไม่ต้องจำทั้งหมด

| ชื่อที่แสดง | คำสั่ง | หน้าที่ |
|---|---|---|
| ถามให้ชัด | [ask-questions](../.agents/skills/ask-questions/SKILL.md) | ถามเฉพาะประเด็นที่ยังไม่ชัด |
| ทำศัพท์ให้ตรงกัน | [define-terms](../.agents/skills/define-terms/SKILL.md) | เก็บคำศัพท์และความหมายร่วมกัน |
| จัดโครงสร้างโค้ด | [design-code](../.agents/skills/design-code/SKILL.md) | ออกแบบส่วนของโค้ดให้อ่านและแก้ได้ |
| เขียนพร้อมทดสอบ | [test-first](../.agents/skills/test-first/SKILL.md) | ทดสอบพฤติกรรมสำคัญระหว่างสร้าง |
| ตรวจโค้ด | [review-code](../.agents/skills/review-code/SKILL.md) | ตรวจทั้งมาตรฐานและความตรงกับโจทย์ |
| ลองทำต้นแบบ | [preview-dashboard](../.agents/skills/preview-dashboard/SKILL.md) | ทำแบบที่เปิดดูหรือคลิกลองได้ |
| ค้นข้อมูล | [find-information](../.agents/skills/find-information/SKILL.md) | หาข้อเท็จจริงจากแหล่งอ้างอิง |
| เขียนคำสั่งให้ AI | [write-instructions](../.agents/skills/write-instructions/SKILL.md) | ปรับคำสั่งในโปรเจกต์ให้ชัดเจน |

## วิธีใช้ในแต่ละแอป

- หากแอปรองรับเมนู Skills ให้เลือกชื่อข้างต้นตามวิธีของแอป
- ถ้าไม่พบคำสั่ง ให้พิมพ์ **“อ่าน .agents/skills/plan-dashboard/SKILL.md แล้วใช้สกิลนี้ช่วยฉันออกแบบ Dashboard”** การอ่านไฟล์ไม่ใช่การติดตั้งสกิลส่วนกลาง
- 4 สกิลหลักให้ผู้ใช้เรียกอย่างชัดเจน ส่วน 8 ตัวช่วยใช้ประกอบได้ตาม policy การเรียก `build-dashboard` ครอบคลุมขั้นตอนภายในของมันแล้ว
- หากไม่มี subagents หรือ worktrees ให้ทำทีละส่วนและตรวจแยกมุมมองในแชตเดิม โดยบอกข้อจำกัดตามจริง
- หากมี Matt Pocock Skills ส่วนกลางอยู่แล้ว ให้เลือกชุดของคลาสในโปรเจกต์นี้ ชุดนี้ไม่เปลี่ยนชื่อหรือแก้สกิลส่วนกลางของเครื่อง

โปรเจกต์เตรียม `.scratch/` เป็นที่เก็บสเปก งานย่อย และคำถามที่ต้องตัดสินใจ พร้อมคำศัพท์ใน GLOSSARY.md แล้ว จึงไม่ต้องตั้งค่า tracker ก่อนเริ่มคุย ความต้องการแต่ละคนอยู่ใน BRIEF.md ไม่ต้องแก้ทุก SKILL.md

## ชื่อเดิม → ชื่อใหม่

ตารางนี้มีไว้เทียบกับต้นทาง ไม่ใช่รายการคำสั่งที่ต้องเรียกเพิ่ม

| ชื่อเดิม | ชื่อในคลาส |
|---|---|
| ask-matt | choose-skill |
| grill-with-docs | plan-dashboard |
| to-spec, implement, to-tickets, implement-spec, wayfinder, triage, improve-codebase-architecture, retro | **build-dashboard** — รวมทั้ง 8 เป็นสกิลเดียว |
| setup-matt-pocock-skills | setup-project |
| grilling | ask-questions |
| domain-modeling | define-terms |
| codebase-design | design-code |
| tdd | test-first |
| code-review | review-code |
| prototype | preview-dashboard |
| research | find-information |
| writing-for-agents | write-instructions |

## ที่มา

ดัดแปลงจาก [mattpocock/skills](https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336) ภายใต้ [MIT License](../.agents/skills/LICENSE.mattpocock) โดยเปลี่ยนชื่อ รวมขั้นตอน และเพิ่มทางทำงานเมื่อไม่มี subagent หรือ Git ไฟล์จึงไม่ใช่สำเนาต้นทางทั้งหมดแบบเดิม

[skills.lock.json](../skills.lock.json) บันทึก hash ของไฟล์ที่แจกจริงและที่มาของต้นฉบับ ดู [เครดิต](../THIRD_PARTY_NOTICES.md) และ [วิธีตรวจ](verification.md)
