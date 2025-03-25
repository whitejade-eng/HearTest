# SevenTest

基于微信小程序和 Django 的听力检测工具，帮助用户自助完成**纯音测试**、**七音测试**和**最小可识别信噪比测试**，快速评估听力状况。

----------

## 📌 核心功能

### 小程序端（Mina + Canvas）HearTest

-   ​**用户信息采集**  
    记录年龄、性别及听力状况
-   ​**听力检测模块**
    -   🔊 ​**纯音测试**：250Hz~10000Hz频率范围内的纯音检测
    -   🎵 ​**七音测试**：识别常见频率的能力评估
    -   📊 ​**最小可识别信噪比测试**：不同噪声下的最小可识别信噪比测定
-   ​**可视化报告**  
    通过 Canvas 实时生成七音测试和最小可识别信噪比测试的结果柱状图
    通过后端生成纯音测试结果图，存储后传回前端
### 后端（Django3.2）SevenDjang0

-   🎚️ ​**噪声生成引擎**  
    支持不同信噪比的白噪声、粉噪声、多人言语噪声、言语谱噪声生成
-   📈 ​**数据存储**  
    用户测试记录存储至 MySQL 数据库
## 🛠 技术栈
| 模块 | 技术组件 |
|--|--|
|前端  | 微信小程序 Mina 框架+Canvas |
|后端  | Python3.8+Django3.2 |
|数据库  | MySQL6.3 |
|音频处理  |librosa + SciPy + soundfile  |

# 运行环境
```bash
# 克隆项目
git clone https://github.com/yourname/hearing-test.git
cd hearing-test
```

### 后端服务部署	
以下是基于你提供的信息生成的 ​**READMDME 模板**，已结合听力检测场景优化重点功能说明和技术细节：

#### 2 .安装依赖

bash

```bash
pip install -r requirements.txt
```

**依赖列表示例（`requirements.txt`）：​**

text

```text
# 核心框架
Django==3.2                # Django 框架核心
djangorestframework==3.14.0  # REST API 支持

# 数据库与驱动
pymysql==1.0.2             # MySQL 连接驱动

# 音频处理模块
librosa==0.9.2             # 音频分析
soundfile==0.12.1          # 音频文件读写

# 数学计算与信号处理
numpy==1.24.3              # 数学基础库
scipy==1.10.1              # 信号处理与滤波器设计

# 数据可视化
matplotlib==3.7.1          # 图表生成

# 系统工具
threading6==1.0.0          # 线程管理
python-dotenv==1.0.0       # 环境变量管理
```

#### 3. 数据库配置

修改  `settings.py`：

```python
DATABASES = {  
    "default": {  
        'ENGINE': "django.db.backends.mysql",  
  'NAME': 'rapid7tonedetermination', # 数据库名称  
  'HOST': 'localhost', # 数据库地址，本机 ip
    'PORT': 3306, # 端口  
  'USER': 'root', # 数据库用户名  
  'PASSWORD': 'root', # 数据库密码  
  }  
}
```
生成数据库：

```bash
# 创建数据库（需提前在 MySQL 中执行）
mysql -u root -p -e "CREATE DATABASE rapid7tonedetermination CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Python
python manage.py makemigrations
python manage.py migrate
```
#### 4. 启动服务

bash

```bash
python manage.py runserver 0.0.0.0:8000
```
## 📊 ​**噪声生成部分代码**


    class RpaidGetNoise (APIView):
    def NoiseWhite(self, NoiseSNR, src, outsrc, sr=16000):
        # 加性高斯白噪声
        src, sr = librosa.core.load(src, sr=sr)
        randomValues = np.random.rand(len(src))
        # 计算语音信号功率Ps和噪声功率Pn1
        Ps = np.sum(src ** 2) / len(src)
        Pn1 = np.sum(randomValues ** 2) / len(randomValues)
        # 计算K值
        k = math.sqrt(Ps / (10 ** (NoiseSNR / 10) * Pn1))
        # 噪声数据乘以K
        randomValuesNeed = randomValues * k
        # 计算新的噪声数据功率
        Pn = np.sum(randomValuesNeed ** 2) / len(randomValuesNeed)
        # 以下开始计算信噪比
        snr = 10 * math.log10(Ps / Pn)
        print("当前信噪比：", snr)
        # 将噪声数据叠加到纯净音频上面
        outdata = src + randomValuesNeed
        # 将叠加噪声的数据写入文件
        sf.write(outsrc, outdata, sr)
    def NoisePink(self, NoiseSNR, src, outsrc, sr=16000):
    
        src, sr = librosa.core.load(src, sr=sr)
        pinkNoise = np.random.randn(len(src))
        b, a = signal.butter(1, 1 / 2, 'high', analog=False)
        pinkNoise = signal.filtfilt(b, a, pinkNoise)
        Ps = np.sum(src ** 2) / len(src)
        Pn1 = np.sum(pinkNoise ** 2) / len(pinkNoise)
        k = math.sqrt(Ps / (10 ** (NoiseSNR / 10) * Pn1))
        pinkNoise = pinkNoise * k
        Pn = np.sum(pinkNoise ** 2) / len(pinkNoise)
        snr = 10 * math.log10(Ps / Pn)
        print("当前pink信噪比：", snr)
        outdata = src + pinkNoise
        sf.write(outsrc, outdata, sr)

    def NoiseBB(self, NoiseSNR, src, outsrc, sr=16000, num_mixes=5):
        # 获取 babble 文件夹中的所有语音文件
        speech_folder = r"D:\TUT\Seven\SevenDjang0\static\mic\babble"
        all_files = [f for f in os.listdir(speech_folder) if f.startswith('n') and f.endswith('.wav')]

        # 随机选择 num_mixes 个语音文件
        selected_files = random.sample(all_files, num_mixes)
        # 加载所有选中的语音文件
        speech_signals = []
        for file in selected_files:
            file_path = os.path.join(speech_folder, file)
            signal, _ = librosa.load(file_path, sr=sr)
            speech_signals.append(signal)
        # 确定混合长度为最短语音文件长度
        min_length = min([len(signal) for signal in speech_signals])
        truncated_signals = [signal[:min_length] for signal in speech_signals]

        # 混合所有选定的语音段，生成 babble 噪声
        babble_noise = np.sum(truncated_signals, axis=0) / num_mixes  # 归一化

        # 加载纯净语音信号
        clean_speech, _ = librosa.load(src, sr=sr)

        # 将 babble 噪声的长度调整为与 clean_speech 长度相同
        if len(clean_speech) > len(babble_noise):
            # 如果清洁语音信号长，则填充噪声
            babble_noise = np.pad(babble_noise, (0, len(clean_speech) - len(babble_noise)))
        else:
            # 如果噪声长，则截断噪声
            babble_noise = babble_noise[:len(clean_speech)]

        # 计算纯净语音信号和初始 babble 噪声的功率
        Ps = np.sum(clean_speech ** 2) / len(clean_speech)
        Pn1 = np.sum(babble_noise ** 2) / len(babble_noise)

        # 调整 babble 噪声幅值以实现目标信噪比
        k = math.sqrt(Ps / (10 ** (NoiseSNR / 10) * Pn1))
        babble_noise_scaled = babble_noise * k

        # 验证生成噪声的实际信噪比
        Pn = np.sum(babble_noise_scaled ** 2) / len(babble_noise_scaled)
        snr = 10 * math.log10(Ps / Pn)
        print("实际信噪比：", snr)

        # 将调整后的 babble 噪声叠加到纯净语音信号上
        mixed_signal = clean_speech + babble_noise_scaled

        # 保存输出混合信号
        sf.write(outsrc, mixed_signal, sr)
        print(f"生成的带 babble 噪声语音文件保存到: {outsrc}")

    def NoiseSSN(self, NoiseSNR, src, outsrc, sr=16000, n_mels=40):
        
        src, sr = librosa.load(src, sr=sr)

        # 生成白噪声
        randomValues = np.random.randn(len(src))

        # 提取语音信号的梅尔频谱特性
        mel_filter_bank = librosa.filters.mel(sr=sr, n_fft=2048, n_mels=n_mels)
        S = np.abs(librosa.stft(src, n_fft=2048)) ** 2
        mel_spectrogram = np.dot(mel_filter_bank, S)

        # 将白噪声调整为梅尔频谱特性
        noise_spectrogram = mel_spectrogram.mean(axis=1)  # 取平均值生成滤波特性
        noise_filtered = lfilter(noise_spectrogram, [1], randomValues)  # 滤波白噪声

        # 计算语音信号功率和初始噪声功率
        Ps = np.sum(src ** 2) / len(src)
        Pn1 = np.sum(noise_filtered ** 2) / len(noise_filtered)

        # 调整噪声幅值以实现目标信噪比
        k = math.sqrt(Ps / (10 ** (NoiseSNR / 10) * Pn1))
        noise_scaled = noise_filtered * k

        # 验证生成噪声的实际信噪比
        Pn = np.sum(noise_scaled ** 2) / len(noise_scaled)
        snr = 10 * math.log10(Ps / Pn)
        print("实际信噪比：", snr)

        # 将噪声叠加到语音信号上
        outdata = src + noise_scaled

        # 写入输出文件
        sf.write(outsrc, outdata, sr)
